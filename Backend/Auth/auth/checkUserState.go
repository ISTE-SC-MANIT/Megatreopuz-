package auth

import (
	"context"

	pb "github.com/ISTE-SC-MANIT/megatreopuz-auth/protos"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// CheckUserState is the rpc to check whether the user has been init
func (s *Server) CheckUserState(ctx context.Context, req *pb.Empty) (*pb.CheckStateResponse, error) {

	decoded, err := utils.GetUserFromFirebase(ctx, s.AuthClient)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Could not identify the user")
	}

	count, err := s.MongoClient.Count(ctx, "_id", decoded.UID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "MongoDB could not check the user entry")
	}

	return &pb.CheckStateResponse{
		Initialised: count != 0,
	}, nil

}
