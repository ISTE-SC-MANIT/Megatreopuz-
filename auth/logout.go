package auth

import (
	"context"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
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

	tokenData, err := ExtractTokensFromMetata(md)

	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Invalid metadata: %s", err.Error())
	}

	// User not logged in
	if tokenData == nil {
		return &proto.Empty{}, nil
	}

	redisCtx, cancel := context.WithTimeout(s.RedisContext, Deadline)
	pipe := s.RedisClient.Pipeline()
	defer cancel()

	pipe.Del(redisCtx, tokenData.Refresh.UUID)

	if tokenData.Access != nil {
		pipe.Del(redisCtx, tokenData.Access.UUID)
	}

	_, err = pipe.Exec(redisCtx)
	if err != nil {
		return nil, status.Error(codes.Unavailable, "Could not execute the redis pipeline")
	}

	return &proto.Empty{}, nil
}
