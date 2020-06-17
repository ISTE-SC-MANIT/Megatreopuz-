package auth

import (
	"context"
	"log"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// ValidateUser : rpc called before every request
func (s *Server) ValidateUser(ctx context.Context, req *proto.Empty) (*proto.Status, error) {

	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()

	// Extracting data from requests
	md, ok := metadata.FromIncomingContext(ctx)
	now := time.Now()
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadata.")
	}

	//Extracting refresh token
	refreshTokenSlice, ok := md["refresh"]
	if !ok {
		return nil, status.Errorf(codes.Internal, "Can't extract refresh Token from metadata")
	}
	refreshToken := refreshTokenSlice[0]

	rUUID, err := ExtractTokenMetadata(refreshToken)

	//if not valid refresh token then user is logged out
	//Case 1: User not have valid refresh token
	if err != nil {
		return &proto.Status{
			IsUserLoggedIn: false,
			AccessToken:    "",
			RefreshToken:   "",
		}, nil
	}

	//check for access token
	accessTokenSlice, ok := md["authorization"]

	//we user have access token
	if ok && accessTokenSlice[0] != "" {
		accessToken := accessTokenSlice[0]

		//checking  validity of token and extracting details from tokens
		aUUID, err := ExtractTokenMetadata(accessToken)
		if err != nil {
			log.Println(`Error extracting access token information: `, err.Error())
			return nil, status.Errorf(codes.InvalidArgument, "Invalid accesss token")
		}
		Username, err := ExtractTokenMetadataUserName(accessToken)
		if err != nil {
			log.Println(`Error extracting access token information: `, err.Error())
			return nil, status.Errorf(codes.InvalidArgument, "Invalid accesss token")
		}
		accessTokenExpiryTime, err := GetExpiryTime(redisContext, s.RedisClient, aUUID)

		refreshTokenExpiryTime, err := GetExpiryTime(redisContext, s.RedisClient, rUUID)
		//Case2: when user have valid access and refresh tokens and they fulfill there respective required deadlines of renewal
		if accessTokenExpiryTime > 120 && refreshTokenExpiryTime > 1800 {
			return &proto.Status{
				IsUserLoggedIn: true,
				AccessToken:    "",
				RefreshToken:   "",
			}, nil
		}
		//Case3: when refresh token fulfill its renewal criteria but access token not.
		if accessTokenExpiryTime < 120 && refreshTokenExpiryTime > 1800 {
			pipe := s.RedisClient.Pipeline()
			newAccessToken, err := CreateAccessToken(Username)
			if err != nil {
				return nil, status.Errorf(codes.InvalidArgument, "Unable to create Token")
			}
			accessDelErr := pipe.Del(redisContext, aUUID)
			if accessDelErr != nil {
				return nil, status.Errorf(codes.Internal, "Unable to delete existing access token from reddis")
			}
			accessErr := pipe.Set(redisContext, newAccessToken.UUID, Username, newAccessToken.ExpiresTimestamp.Sub(now)).Err()
			if accessErr != nil {
				return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
			}
			_, pipeError := pipe.Exec(ctx)
			if pipeError != nil {
				return nil, status.Errorf(codes.Internal, "unable to perform redis operations ")
			}
			return &proto.Status{
				IsUserLoggedIn: true,
				AccessToken:    newAccessToken.Token,
				RefreshToken:   ""}, nil

		}
		//Case4: when neither of them fulfill there respective renewal criteria.
		if accessTokenExpiryTime < 120 && refreshTokenExpiryTime < 1800 {
			pipe := s.RedisClient.Pipeline()
			newAccessToken, err := CreateAccessToken(Username)
			if err != nil {
				return nil, status.Errorf(codes.InvalidArgument, "Unable to create access Token")
			}
			newRefreshToken, err := CreateRefreshToken(Username)
			if err != nil {
				return nil, status.Errorf(codes.InvalidArgument, "Unable to create refresh Token")
			}

			accessDelErr := pipe.Del(redisContext, aUUID)
			if accessDelErr != nil {
				return nil, status.Errorf(codes.Internal, "Unable to delete existing access token from reddis")
			}
			refreshDelErr := pipe.Del(redisContext, rUUID)
			if refreshDelErr != nil {
				return nil, status.Errorf(codes.Internal, "Unable to delete existing refresh token from reddis")
			}

			accessErr := pipe.Set(redisContext, newAccessToken.UUID, Username, newAccessToken.ExpiresTimestamp.Sub(now)).Err()
			if accessErr != nil {
				return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
			}
			refreshErr := pipe.Set(redisContext, newRefreshToken.UUID, Username, newRefreshToken.ExpiresTimestamp.Sub(now)).Err()
			if refreshErr != nil {
				return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
			}
			_, pipeError := pipe.Exec(redisContext)
			if pipeError != nil {
				return nil, status.Errorf(codes.Internal, "unable to perform redis operations ")
			}
			return &proto.Status{
				IsUserLoggedIn: true,
				AccessToken:    newAccessToken.Token,
				RefreshToken:   newAccessToken.Token}, nil

		}

	}
	//Users Not having a access token
	Username, err := ExtractTokenMetadataUserName(refreshToken)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unable to get username from refresh token")
	}
	refreshTokenExpiryTime, err := GetExpiryTime(redisContext, s.RedisClient, rUUID)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unable to get expiry time of refresh token")
	}

	//Case5:if refresh token does not fullfill its renewal criteria
	if refreshTokenExpiryTime < 1800 {

		pipe := s.RedisClient.Pipeline()
		newAccessToken, err := CreateAccessToken(Username)
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "Unable to create access Token")
		}
		newRefreshToken, err := CreateRefreshToken(Username)
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "Unable to create refresh Token")
		}

		refreshDelErr := pipe.Del(redisContext, rUUID)
		if refreshDelErr != nil {
			return nil, status.Errorf(codes.Internal, "Unable to delete existing refresh token from reddis")
		}

		accessErr := pipe.Set(redisContext, newAccessToken.UUID, Username, newAccessToken.ExpiresTimestamp.Sub(now)).Err()
		if accessErr != nil {
			return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
		}
		refreshErr := pipe.Set(redisContext, newRefreshToken.UUID, Username, newRefreshToken.ExpiresTimestamp.Sub(now)).Err()
		if refreshErr != nil {
			return nil, status.Errorf(codes.Internal, "unable to save token in redis ")

		}

		_, pipeError := pipe.Exec(redisContext)
		if pipeError != nil {
			return nil, status.Errorf(codes.Internal, "unable to perform redis operations ")
		}
		return &proto.Status{
			IsUserLoggedIn: true,
			AccessToken:    newAccessToken.Token,
			RefreshToken:   newAccessToken.Token}, nil

	}
	//Case6: if refresh token fullfills its renewal criteria
	pipe := s.RedisClient.Pipeline()
	newAccessToken, err := CreateAccessToken(Username)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Unable to create Token")
	}

	accessErr := pipe.Set(redisContext, newAccessToken.UUID, Username, newAccessToken.ExpiresTimestamp.Sub(now)).Err()
	if accessErr != nil {
		return nil, status.Errorf(codes.Internal, "unable to save token in redis ")
	}
	_, error := pipe.Exec(redisContext)
	if error != nil {
		return nil, status.Errorf(codes.Internal, "unable to save tokens in redis ")
	}
	return &proto.Status{
		IsUserLoggedIn: true,
		AccessToken:    newAccessToken.Token,
		RefreshToken:   ""}, nil

}
