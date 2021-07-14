package user

import (
	"context"
	"fmt"

	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
	"go.mongodb.org/mongo-driver/bson"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
)

//GetLeaderBoard is the rpc to get leaderBoard
func (s *Server) GetLeaderBoard(ctx context.Context, req *pb.Empty) (*pb.GetLeaderBoardResponse, error) {
	_, err := utils.GetUserFromFirebase(ctx, s.AuthClient)
	if err != nil {
		log.Println(err)
		return nil, status.Errorf(codes.Unauthenticated, "Could not identify the user")
	}

	var results []user.User
	var modifiedUsers []*pb.User

	database := s.MongoClient.Database(os.Getenv("MONGODB_DATABASE"))
	userCollection := database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))
	users, err := userCollection.Find(ctx, bson.D{{}})
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "User has been not initialised")
	}

	for users.Next(ctx) {
		var singleUser user.User

		err := users.Decode(&singleUser)
		fmt.Print(err)
		if err != nil {
			return nil, status.Errorf(codes.Aborted, "something went wrong")
		}

		results = append(results, singleUser)
		var LastAnsweredQuestionTime string
		if len(singleUser.AnsweredQuestions)-1 < 0 {
			LastAnsweredQuestionTime = ""
		} else {
			LastAnsweredQuestionTime = string(singleUser.AnsweredQuestions[len(singleUser.AnsweredQuestions)-1].AnswerTime)
		}

		modifiedUsers = append(modifiedUsers, &pb.User{UserId: singleUser.ID, Username: singleUser.Username, Name: singleUser.Name, QuestionsAttempted: uint32(len(singleUser.AnsweredQuestions)), LastAnsweredQuestionTime: LastAnsweredQuestionTime})
	}

	return &pb.GetLeaderBoardResponse{Users: modifiedUsers}, nil
}
