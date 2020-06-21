package auth

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/dgrijalva/jwt-go"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// Logout : rpc called to log out
func (s *Server) Logout(ctx context.Context, req *proto.Empty) (*proto.Empty, error) {

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadata.")
	}
	refreshTokenSlice, ok := md["refresh"]
	if ok {

		redisCtx, cancel := context.WithTimeout(s.RedisContext, Deadline)
		defer cancel()

		refeshToken := refreshTokenSlice[0]
		// Extracting the details of access tokens
		rUUID, err := extractTokenMetadata(refeshToken)
		if err != nil {
			log.Println(`Error extracting refresh token information: `, err.Error())
			return nil, status.Errorf(codes.InvalidArgument, "Invalid refresh token")
		}
		accessTokenSlice, ok := md["authorization"]
		if ok {
			accessToken := accessTokenSlice[0]
			// Extracting the details of access tokens
			aUUID, err := extractTokenMetadata(accessToken)
			if err != nil {
				log.Println(`Error extracting access token information: `, err.Error())
				return nil, status.Errorf(codes.InvalidArgument, "Invalid access token")
			}
			s.RedisClient.Del(redisCtx, aUUID)
		}
		s.RedisClient.Del(redisCtx, rUUID)
	}

	return &proto.Empty{}, nil

}

func extractTokenMetadata(s string) (string, error) {
	// Validate the accesstoken recieved
	accesstoken, err := validateToken(s)
	if err != nil {
		return "", fmt.Errorf(`Error validating jwt accesstoken: %s`, err.Error())
	}

	// Check the claims
	claims, ok := accesstoken.Claims.(jwt.MapClaims)
	if ok && accesstoken.Valid {
		accessUUID, ok := claims["uuid"].(string)
		if !ok {
			return "", fmt.Errorf(`Cannot parse accesstoken uuid:  %s`, err.Error())
		}
		return accessUUID, nil
	}
	return "", err
}

func validateToken(tokenString string) (*jwt.Token, error) {
	accesstoken, err := jwt.Parse(tokenString, func(accesstoken *jwt.Token) (interface{}, error) {

		if _, ok := accesstoken.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", accesstoken.Header["alg"])
		}

		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return accesstoken, nil
}
