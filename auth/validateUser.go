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

func renewRefreshToken(context context.Context, pipe redis.Pipeliner, client *redis.Client, refreshToken string) (newToken string, Error error) {
	rUUID, err := ExtractTokenMetadata(refreshToken)
	if err != nil {
		return "", status.Errorf(codes.Internal, "Can't extract refresh Token from metadata")
	}
	refreshTokenExpiryTime, err := client.TTL(context, rUUID).Result()
	if err != nil {
		return "", status.Errorf(codes.Internal, "Failed to get Expiry time for refresh token")
	}
	if refreshTokenExpiryTime > 1800 {
		return "", nil
	}

	Username, err := ExtractTokenMetadataUserName(refreshToken)
	if err != nil {
		return "", status.Errorf(codes.InvalidArgument, "Unable to extract user name from refresh token")
	}
	newRefreshToken, err := CreateRefreshToken(Username)
	if err != nil {
		return "", status.Errorf(codes.InvalidArgument, "Unable to create refresh Token")
	}
	now := time.Now()
	refreshDelErr := pipe.Del(context, rUUID)
	if refreshDelErr != nil {
		return "", status.Errorf(codes.Internal, "Unable to delete existing refresh token from reddis")
	}
	refreshErr := pipe.Set(context, newRefreshToken.UUID, Username, newRefreshToken.ExpiresTimestamp.Sub(now)).Err()
	if refreshErr != nil {
		return "", status.Errorf(codes.Internal, "unable to save token in redis ")
	}

	return newRefreshToken.Token, nil

}

func renewAccessToken(context context.Context, pipe redis.Pipeliner, client *redis.Client, md metadata.MD, Username string) (newToken string, Error error) {

	newAccessToken, err := CreateAccessToken(Username)
	if err != nil {
		return "", status.Errorf(codes.InvalidArgument, "Unable to create access Token")
	}
	now := time.Now()
	accessTokenSlice, ok := md["authorization"]
	if ok && accessTokenSlice[0] != "" {
		aUUID, err := ExtractTokenMetadata(accessTokenSlice[0])
		if err != nil {
			log.Println(`Error extracting access token information: `, err.Error())
			return "", status.Errorf(codes.InvalidArgument, "Invalid accesss token")
		}
		accessTokenExpiryTime, err := client.TTL(context, aUUID).Result()
		if err != nil {
			return "", status.Errorf(codes.Internal, "Failed to get Expiry time for access token")
		}
		if accessTokenExpiryTime > 120 {
			return "", nil
		}
		refreshDelErr := pipe.Del(context, aUUID)
		if refreshDelErr != nil {
			return "", status.Errorf(codes.Internal, "Unable to delete existing access token from reddis")
		}
	}
	refreshErr := pipe.Set(context, newAccessToken.UUID, Username, newAccessToken.ExpiresTimestamp.Sub(now)).Err()
	if refreshErr != nil {
		return "", status.Errorf(codes.Internal, "unable to save token in redis ")
	}

	return newAccessToken.Token, nil

}

// ValidateUser : rpc called before every request
func (s *Server) ValidateUser(ctx context.Context, req *proto.Empty) (*proto.Status, error) {
	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()
	pipe := s.RedisClient.Pipeline()
	// Extracting data from requests
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadata.")
	}
	//Extracting refresh token
	refreshTokenSlice, ok := md["refresh"]
	if !ok {
		return &proto.Status{
			IsUserLoggedIn: false,
			AccessToken:    "",
			RefreshToken:   "",
		}, nil

	}
	refreshToken := refreshTokenSlice[0]

	Username, err := ExtractTokenMetadataUserName(refreshToken)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Can't extract refresh Token from metadata")
	}
	newRefreshToken, err := renewRefreshToken(redisContext, pipe, s.RedisClient, refreshTokenSlice[0])
	if err != nil {
		return nil, status.Errorf(codes.Internal, string(err.Error()))
	}
	newAccessToken, err := renewAccessToken(redisContext, pipe, s.RedisClient, md, Username)
	if err != nil {
		return nil, status.Errorf(codes.Internal, string(err.Error()))
	}
	_, pipeError := pipe.Exec(redisContext)
	if pipeError != nil {
		return nil, status.Errorf(codes.Internal, "unable to perform redis operations ")
	}

	return &proto.Status{
		IsUserLoggedIn: true,
		AccessToken:    newAccessToken,
		RefreshToken:   newRefreshToken}, nil

}
