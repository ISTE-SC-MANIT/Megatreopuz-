package auth

import (
	"context"
	"os"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

//UpdatePassword ...
func (s *Server) UpdatePassword(ctx context.Context, req *proto.UpdatePasswordRequest) (*proto.Empty, error) {
	passwordID, newPassword := req.GetPasswordID(), req.GetNewPassword()
	if passwordID == "" || newPassword == "" {
		return nil, status.Errorf(codes.InvalidArgument, "PasswordID or new Password cant be empty")
	}
	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()
	email, err := s.RedisClient.Get(redisContext, passwordID).Result()
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Invalid Password ID")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.MinCost)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unable to hash Password")
	}

	s.RedisClient.Del(redisContext, passwordID)

	_, err = s.MongoClient.Database(os.Getenv("MONGODB_DATABASE")).Collection(os.Getenv("MONGODB_USERCOLLECTION")).UpdateOne(
		ctx,
		bson.M{"email": bson.M{"$eq": email}},
		bson.M{"$set": bson.M{"password": string(hashedPassword)}})
	if err != nil {
		return nil, status.Errorf(codes.Internal, err.Error())
	}

	return &proto.Empty{}, nil

}
