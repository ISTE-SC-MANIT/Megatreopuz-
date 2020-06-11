package auth

import (
	"context"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
)

// Logout : rpc to log the user out
func (s *Server) Logout(context.Context, *proto.Empty) (*proto.Empty, error) {
	return nil, nil
}
