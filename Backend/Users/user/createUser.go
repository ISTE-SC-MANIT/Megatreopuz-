package user

import (
	"context"
	"fmt"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
	"time"
)

// CreateLocalPlayer is the rpc to create a local player's entry
func (s *Server) CreateLocalPlayer(ctx context.Context, req *pb.CreateLocalPlayerRequest) (*pb.Empty, error) {

	fmt.Println("working")
	decoded, err := utils.GetUserFromFirebase(ctx, s.AuthClient)

	if err != nil {
		fmt.Println(err)
		return nil, status.Errorf(codes.Unauthenticated, "Could not identify the user")
	}

	u := user.User{
		ID:                decoded.UID,
		AnsweredQuestions: []user.QuestionsAnswered{},
		College:           req.GetCollege(),
		CreatedAt:         primitive.NewDateTimeFromTime(time.Now()),
		UpdatedAt:         primitive.NewDateTimeFromTime(time.Now()),
		Country:           req.GetCountry(),
		Name:              req.GetName(),
		Phone:             req.GetPhone(),
		Rank:              0,
		Username:          req.GetUsername(),
		Year:              int(req.GetYear()),
	}
	fmt.Println(u)

	database := s.MongoClient.Database(os.Getenv("MONGODB_DATABASE"))
	userCollection := database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))
	_, err = userCollection.InsertOne(ctx, u)
	if err != nil {
		fmt.Println(err)
		return nil, status.Errorf(codes.Internal, "database refused to create user")
	}
	return &pb.Empty{}, nil
}
