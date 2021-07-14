package auth

import (
	"context"

	pb "github.com/ISTE-SC-MANIT/megatreopuz-auth/protos"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// CheckUsernameAvailability is the rpc to check the username
func (s *Server) CheckUsernameAvailability(ctx context.Context, req *pb.CheckUsernameAvailabilityRequest) (*pb.CheckUsernameAvailabilityResponse, error) {
	c, err := s.MongoClient.Count(ctx, "username", req.GetUsername())

	if err != nil {
		return nil, status.Error(codes.Internal, "Error while interacting with database")
	}
	return &pb.CheckUsernameAvailabilityResponse{
		Available: c == 0,
	}, nil
}
