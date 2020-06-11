package auth

import (
	"context"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
)

// Login : rpc called to login
func (*Server) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {
	return &proto.LoginResponse{
		AcessToken:   "Lorem",
		RefreshToken: "Ipsum",
	}, nil
}
