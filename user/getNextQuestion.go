package user

import (
	"context"
	"fmt"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/question"

	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
	"go.mongodb.org/mongo-driver/bson"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
)

//GetNextQuestion is the rpc to get player's entry
func (s *Server) GetNextQuestion(ctx context.Context, req *pb.Empty) (*pb.GetNextQuestionRespone, error) {
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
	q := question.Question{}

	var currentQuestion = len(u.AnsweredQuestions) + 1
	fmt.Println(currentQuestion)
	questionCollection := database.Collection(os.Getenv("MONGODB_QUESTIONCOLLECTION"))

	if err := questionCollection.FindOne(ctx, bson.M{"questionNo": currentQuestion}).Decode(&q); err != nil {
		return nil, status.Errorf(codes.PermissionDenied, "Invalid Question")
	}

	// n,e :=strconv.Atoi(q.QuestionNo);e!=nil{
	// 	return nil, status.Errorf(codes.PermissionDenied, "Invalid Question")
	// }

	return &pb.GetNextQuestionRespone{QuestionNo: uint32(q.QuestionNo), Question: q.ImageUrl, QuestionId: q.ID}, nil
}
