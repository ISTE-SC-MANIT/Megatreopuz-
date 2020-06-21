package auth

import (
	"context"
	"log"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/go-redis/redis/v8"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type TokenChannel struct {
	token *string
	Err   error
}

func renewRefreshToken(context context.Context, pipe redis.Pipeliner, client *redis.Client, refreshToken string, c chan *TokenChannel) (newToken *string, Error error) {
	rUUID, err := ExtractTokenMetadata(refreshToken)
	if err != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.Internal, "Can't extract refresh Token from metadata")
	}
	refreshTokenExpiryTime, err := client.TTL(context, rUUID).Result()
	if err != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.Internal, "Failed to get Expiry time for refresh token")
	}
	if refreshTokenExpiryTime > 1800 {
		c <- &TokenChannel{token: nil, Err: nil}
		return nil, nil
	}

	Username, err := ExtractTokenMetadataUserName(refreshToken)
	if err != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.InvalidArgument, "Unable to extract user name from refresh token")
	}
	newRefreshToken, err := CreateRefreshToken(Username)
	if err != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.InvalidArgument, "Unable to create refresh Token")
	}
	now := time.Now()
	refreshDelErr := pipe.Del(context, rUUID)
	if refreshDelErr != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.Internal, "Unable to delete existing refresh token from reddis")
	}
	refreshErr := pipe.Set(context, newRefreshToken.UUID, Username, newRefreshToken.ExpiresTimestamp.Sub(now)).Err()
	if refreshErr != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
	}
	c <- &TokenChannel{token: &newRefreshToken.Token, Err: nil}
	return &newRefreshToken.Token, nil

}

func renewAccessToken(context context.Context, pipe redis.Pipeliner, client *redis.Client, md metadata.MD, Username string, c chan *TokenChannel) (newToken *string, Error error) {

	newAccessToken, err := CreateAccessToken(Username)
	if err != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.InvalidArgument, "Unable to create access Token")
	}
	now := time.Now()
	accessTokenSlice, ok := md["authorization"]
	if ok && accessTokenSlice[0] != "" {
		aUUID, err := ExtractTokenMetadata(accessTokenSlice[0])
		if err != nil {
			c <- &TokenChannel{token: nil, Err: err}
			log.Println(`Error extracting access token information: `, err.Error())
			return nil, status.Errorf(codes.InvalidArgument, "Invalid accesss token")
		}
		accessTokenExpiryTime, err := client.TTL(context, aUUID).Result()
		if err != nil {
			c <- &TokenChannel{token: nil, Err: err}
			return nil, status.Errorf(codes.Internal, "Failed to get Expiry time for access token")
		}
		if accessTokenExpiryTime > 120 {
			c <- &TokenChannel{token: nil, Err: nil}
			return nil, nil
		}
		refreshDelErr := pipe.Del(context, aUUID)
		if refreshDelErr != nil {
			c <- &TokenChannel{token: nil, Err: err}
			return nil, status.Errorf(codes.Internal, "Unable to delete existing access token from reddis")
		}
	}
	refreshErr := pipe.Set(context, newAccessToken.UUID, Username, newAccessToken.ExpiresTimestamp.Sub(now)).Err()
	if refreshErr != nil {
		c <- &TokenChannel{token: nil, Err: err}
		return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
	}
	c <- &TokenChannel{token: &newAccessToken.Token, Err: nil}
	return &newAccessToken.Token, nil

}

// ValidateUser : rpc called before every request
func (s *Server) ValidateUser(ctx context.Context, req *proto.Empty) (*proto.Status, error) {
	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()
	pipe := s.RedisClient.Pipeline()
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadata.")
	}
	refreshTokenSlice, ok := md["refresh"]
	if !ok {
		return &proto.Status{
			IsUserLoggedIn: false,
		}, nil

	}
	refreshToken := refreshTokenSlice[0]
	Username, err := ExtractTokenMetadataUserName(refreshToken)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Can't extract refresh Token from metadata")
	}

	c := make(chan *TokenChannel)
	go renewRefreshToken(redisContext, pipe, s.RedisClient, refreshTokenSlice[0], c)
	newRefreshTokenChannel := <-c
	if newRefreshTokenChannel.Err != nil {
		return nil, status.Errorf(codes.Internal, string(err.Error()))
	}
	go renewAccessToken(redisContext, pipe, s.RedisClient, md, Username, c)
	newAccessTokenChannel := <-c
	if newAccessTokenChannel.Err != nil {
		return nil, status.Errorf(codes.Internal, string(err.Error()))
	}
	_, pipeError := pipe.Exec(redisContext)
	if pipeError != nil {
		return nil, status.Errorf(codes.Internal, "unable to perform redis operations ")
	}

	result := &proto.Status{IsUserLoggedIn: true}

	if newRefreshTokenChannel.token != nil {
		result.RefreshToken = *newRefreshTokenChannel.token
	}
	if newAccessTokenChannel.token != nil {
		result.AccessToken = *newAccessTokenChannel.token
	}

	return result, nil

}
