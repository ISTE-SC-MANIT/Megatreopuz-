package auth

import (
	"context"
	"fmt"
	"os"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/dgrijalva/jwt-go"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// Logout ... : rpc called to login
func (s *Server) Logout(ctx context.Context, req *proto.Empty) (*proto.Empty, error) {

	//Extracting the token from metadata of request
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadatas")
	}
	token := md["authorization"][0]

	//Extracting the Details of tokens
	au, err := ExtractAccessTokenMetadata(token)
	if err != nil {

		return nil, status.Errorf(codes.Unauthenticated, "Invalid Token")
	}
	//Deleting it from Redis Database
	s.RedisClient.Del(ctx, au.AccessUUID)
	return &proto.Empty{}, nil

}

//ExtractAccessTokenMetadata ...
func ExtractAccessTokenMetadata(s string) (*AccessDetails, error) {
	token, err := VerifyToken(s)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUUID, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}
		username, ok := claims["user_id"].(string)
		if !ok {
			return nil, err
		}
		return &AccessDetails{
			AccessUUID: accessUUID,
			Username:   username,
		}, nil
	}
	return nil, err
}

//VerifyToken ... : verifying the tokens
func VerifyToken(s string) (*jwt.Token, error) {
	tokenString := s

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {

		return nil, err
	}
	return token, nil
}
