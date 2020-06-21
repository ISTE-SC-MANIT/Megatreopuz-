package auth

import (
	"context"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/go-redis/redis/v8"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

const refreshRenewWindow = time.Second * 1800
const accessRenewWindow = time.Second * 120

type tokenChannel struct {
	token *string
	Err   error
}

func renewRefreshToken(context context.Context, client redis.Client, pipe redis.Pipeliner, refreshToken RefreshTokenParsed, c chan *tokenChannel) {
	refreshTokenExpiryTime, err := client.TTL(context, refreshToken.UUID).Result()

	if err != nil {
		c <- &tokenChannel{token: nil, Err: err}
		return
	}

	if refreshTokenExpiryTime > refreshRenewWindow {
		c <- &tokenChannel{token: nil, Err: nil}
		return
	}

	newRefreshToken, err := CreateRefreshToken(refreshToken.Username)
	if err != nil {
		c <- &tokenChannel{token: nil, Err: err}
		return
	}

	err = pipe.Del(context, refreshToken.UUID).Err()
	if err != nil {
		c <- &tokenChannel{token: nil, Err: err}
		return
	}

	err = pipe.Set(context, newRefreshToken.UUID, refreshToken.Username, newRefreshToken.ExpiresTimestamp.Sub(time.Now())).Err()

	if err != nil {
		c <- &tokenChannel{token: nil, Err: err}
		return
	}
	c <- &tokenChannel{token: &newRefreshToken.Token, Err: nil}
}

func renewAccessToken(context context.Context, client redis.Client, pipe redis.Pipeliner, accessToken *AccessTokenParsed, username string, c chan *tokenChannel) {
	if accessToken != nil {

		accessTokenExpiryTime, err := client.TTL(context, accessToken.UUID).Result()

		if err != nil {
			c <- &tokenChannel{token: nil, Err: err}
			return
		}
		if accessTokenExpiryTime > refreshRenewWindow {
			c <- &tokenChannel{token: nil, Err: nil}
			return
		}
		err = pipe.Del(context, accessToken.UUID).Err()
		if err != nil {
			c <- &tokenChannel{token: nil, Err: err}
			return
		}

	}
	// Will expire soon or has already expired
	newAccessToken, err := CreateRefreshToken(username)
	if err != nil {
		c <- &tokenChannel{token: nil, Err: err}
		return
	}

	err = pipe.Set(context, newAccessToken.UUID, username, newAccessToken.ExpiresTimestamp.Sub(time.Now())).Err()

	if err != nil {
		c <- &tokenChannel{token: nil, Err: err}
		return
	}
	c <- &tokenChannel{token: &newAccessToken.Token, Err: nil}
}

// ValidateUser : rpc to validate user session
func (s *Server) ValidateUser(ctx context.Context, req *proto.Empty) (*proto.Status, error) {

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadata.")
	}

	tokenData, err := ExtractTokensFromMetata(md)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Invalid metadata: %s", err.Error())
	}

	redisContext, cancel := context.WithTimeout(s.RedisContext, time.Minute*10)
	defer cancel()
	pipe := s.RedisClient.Pipeline()

	if tokenData == nil {
		return &proto.Status{
			IsUserLoggedIn: false,
		}, nil
	}
	refreshExists, err := s.RedisClient.Exists(redisContext, tokenData.Refresh.UUID).Result()

	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Could not check refresh token existence: %s", err.Error())
	}

	if refreshExists == 0 {
		return &proto.Status{
			IsUserLoggedIn: false,
		}, nil
	}

	result := &proto.Status{
		IsUserLoggedIn: true,
	}

	refreshChannel := make(chan *tokenChannel)
	go renewRefreshToken(redisContext, *s.RedisClient, pipe, tokenData.Refresh, refreshChannel)

	accessChannel := make(chan *tokenChannel)
	go renewAccessToken(redisContext, *s.RedisClient, pipe, tokenData.Access, tokenData.Refresh.Username, accessChannel)
	t := <-accessChannel
	if t.Err != nil {
		return nil, status.Errorf(codes.Internal, "Could not renew access token: ", t.Err.Error())
	}
	if t.token != nil {
		result.AccessToken = *t.token
	}

	t = <-refreshChannel
	if t.Err != nil {
		return nil, status.Errorf(codes.Internal, "Could not renew refresh token: ", t.Err.Error())
	}
	if t.token != nil {
		result.RefreshToken = *t.token
	}

	_, pipeError := pipe.Exec(redisContext)
	if pipeError != nil {
		return nil, status.Errorf(codes.Internal, "Unable to perform redis operations ")
	}

	return result, nil

}
