package auth

import (
	"context"
	"fmt"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	user "github.com/ISTE-SC-MANIT/megatreopuz-mongo-structs/user"

)

// Login : rpc called to login
func (*Server) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {
	fmt.Println(user.User{})
	return &proto.LoginResponse{
		AcessToken:   "Lorem",
		RefreshToken: "Ipsum",
	}, nil
}
