package auth

import (
	"context"

	pb "github.com/ISTE-SC-MANIT/megatreopuz-auth/protos"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// CheckUserState is the rpc to check whether the user has been init
func (s *Server) CheckUserState(ctx context.Context, req *pb.Empty) (*pb.CheckStateResponse, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Not able to extract metadata.")
	}
	accessTokenSlice, ok := md["authorization"]
	if !ok {
		return nil, status.Errorf(codes.Internal, "Invalid access token.")
	}

	value := accessTokenSlice[0]

	decoded, err := s.AuthClient.VerifySessionCookieAndCheckRevoked(ctx, value)
	if !ok {
		return nil, status.Errorf(codes.Internal, "Cookie could not be verified")
	}

	count, err := s.MongoClient.Count(ctx, "_id", decoded.UID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "MongoDB could not check the user entry")
	}

	return &pb.CheckStateResponse{
		Initialised: count != 0,
	}, nil

}
