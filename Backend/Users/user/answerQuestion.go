package user

import (
	"context"

	"fmt"
	"strings"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/question"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
)

//AnswerQuestion is rpc used by user to answer question
func (s *Server) AnswerQuestion(ctx context.Context, req *pb.AnswerQuestion) (*pb.Empty, error) {
	decoded, err := utils.GetUserFromFirebase(ctx, s.AuthClient)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Could not identify the user")
	}

	u := user.User{}
	database := s.MongoClient.Database(os.Getenv("MONGODB_DATABASE"))
	userCollection := database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))
	if err := userCollection.FindOne(ctx, bson.M{"_id": decoded.UID}).Decode(&u); err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "User has been not initialised")
	}

	var lastAttempt = u.TotalAttempts

	_, attErr := userCollection.UpdateOne(ctx, bson.D{
		primitive.E{Key: "_id", Value: decoded.UID},
	}, bson.D{
		{"$set", bson.D{{"attempts", lastAttempt + 1}}},
	})
	if attErr != nil {
		fmt.Println(attErr)
	}

	q := question.Question{}
	var currentQuestion = len(u.AnsweredQuestions)
	questionCollection := database.Collection(os.Getenv("MONGODB_QUESTIONCOLLECTION"))
	if err := questionCollection.FindOne(ctx, bson.M{"questionNo": currentQuestion + 1}).Decode(&q); err != nil {
		return nil, status.Errorf(codes.PermissionDenied, "Invalid Question")
	}

	if strings.ToLower(strings.ReplaceAll(q.Answer," ","")) != strings.ToLower(strings.ReplaceAll(req.GetAnswer()," ","")) {
		return nil, status.Errorf(codes.InvalidArgument, "Wrong Answer")
	}

	var setUpdateFields bson.D
	var answeredQuestionArray = u.AnsweredQuestions

	var new user.QuestionsAnswered
	new.AnswerTime = time.Now().UTC().Format("2006-01-02T15:04:05-0700")
	new.QuestionID = q.ID
	new.QuestionNo = q.QuestionNo

	fmt.Println(new)
	var modifiedAnswerArray = append(answeredQuestionArray, new)
	setUpdateFields = append(setUpdateFields, bson.E{Key: "answeredQuestions", Value: modifiedAnswerArray})

	_, updateErr := userCollection.UpdateOne(ctx, bson.D{
		primitive.E{Key: "_id", Value: decoded.UID},
	},
		bson.D{
			primitive.E{Key: "$set", Value: setUpdateFields},
		})
	if updateErr != nil {
		return nil, status.Errorf(codes.Internal, "database refused to update user")
	}

	return &pb.Empty{}, nil
}
