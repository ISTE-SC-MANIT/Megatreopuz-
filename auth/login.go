package auth

import (
	"context"
	"log"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/golang/protobuf/ptypes"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Login : rpc called to login
func (s *Server) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {

	// Extracting data from requests
	username, password := req.GetUsername(), req.GetPassword()
	if password == "" {
		return nil, status.Errorf(codes.NotFound,
			"User is not registered locally. Try signing in using google")
	}

	// Getting user form the database
	user, err := GetUserfromDatabase(s.MongoContext, s.MongoClient, username)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "No user exists with username %s.", username)
	}

	if user.Password == nil {
		return nil, status.Errorf(codes.InvalidArgument, "User is not registered locally. Try signing in with Google.")
	}

	// Verifying password
	err = bcrypt.CompareHashAndPassword([]byte(*user.Password), []byte(password))
	if err != nil {
		return nil, status.Errorf(codes.FailedPrecondition,
			"Incorrect password")
	}

	// Creating tokens
	accessToken, err := CreateAccessToken(username)

	if err != nil {
		log.Println("Error while creating access token: ", err.Error())
		return nil, status.Errorf(codes.Internal, "Signing access token failed.")
	}

	// Creating tokens
	refreshToken, err := CreateRefreshToken(username)

	if err != nil {
		log.Println("Error while creating refresh token: ", err.Error())
		return nil, status.Errorf(codes.Internal, "Signing refresh token failed.")
	}

	now := time.Now()
	// Protobuffer serializable timestamps
	accessExpiryProto, err := ptypes.TimestampProto(accessToken.ExpiresTimestamp)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Invalid access token expiration time")
	}

	refreshExpiryProto, err := ptypes.TimestampProto(refreshToken.ExpiresTimestamp)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Invalid refresh token expiration time")
	}

	// Saving to redis database
	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()

	errAccess := s.RedisClient.Set(redisContext, accessToken.UUID, username, accessToken.ExpiresTimestamp.Sub(now)).Err()
	if errAccess != nil {
		return nil, status.Errorf(codes.Internal, "Entry of access token to redis failed.")
	}
	errRefresh := s.RedisClient.Set(redisContext, refreshToken.UUID, username, refreshToken.ExpiresTimestamp.Sub(now)).Err()
	if errRefresh != nil {
		return nil, status.Errorf(codes.Internal, "Entry of refresh token to reddis failed.")
	}

	return &proto.LoginResponse{
		AcessToken:         accessToken.Token,
		RefreshToken:       refreshToken.Token,
		AccessTokenExpiry:  accessExpiryProto.String(),
		RefreshTokenExpiry: refreshExpiryProto.String(),
	}, nil
}
