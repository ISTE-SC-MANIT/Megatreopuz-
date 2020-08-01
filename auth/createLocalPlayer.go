package auth

import (
	"context"
	"fmt"

	pb "github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
)

// CreateLocalPlayer is the RPC to add a new player with username and password
func (s *Server) CreateLocalPlayer(ctx context.Context, req *pb.CreateLocalPlayerRequest) (*pb.Empty, error) {
	
	
	fmt.Println(req.GetName())
	return &pb.Empty{}, nil
}
