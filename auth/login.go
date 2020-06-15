package auth

import (
	"context"
	"fmt"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	user "github.com/ISTE-SC-MANIT/megatreopuz-mongo-structs/user"
)

// Login : rpc called to login
func (s *Server) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {

	s.MongoClient.Database("go").Collection("user");

	fmt.Println(user.User{})
	return &proto.LoginResponse{
		AcessToken:   "Lorem",
		RefreshToken: "Ipsum",
	}, nil
}
