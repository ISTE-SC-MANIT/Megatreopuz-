package user

import (
	"context"

	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
	"go.mongodb.org/mongo-driver/bson"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
)

//GetPlayer is the rpc to get player's entry
func (s *Server) GetPlayer(ctx context.Context, req *pb.Empty) (*pb.GetPlayerResponse, error) {
	decoded, err := utils.GetUserFromFirebase(ctx, s.AuthClient)
	if err != nil {
		log.Println(err)
		return nil, status.Errorf(codes.Unauthenticated, "Could not identify the user")
	}
	u := user.User{}

	database := s.MongoClient.Database(os.Getenv("MONGODB_DATABASE"))
	userCollection := database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))
	if err := userCollection.FindOne(ctx, bson.M{"_id": decoded.UID}).Decode(&u); err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "User has been not initialised")
	}

	return &pb.GetPlayerResponse{Id: u.ID, Username: u.Username, Year: uint32(u.Year), Name: u.Name, College: u.College, Phone: u.Phone, Country: u.Country, TotalSolvedQuestions: uint32(len(u.AnsweredQuestions)), Attempts: uint32(u.TotalAttempts)}, nil
}
