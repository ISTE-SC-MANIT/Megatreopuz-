package user

import (
	"context"
	"encoding/json"

	"github.com/ISTE-SC-MANIT/megatreopuz-models/question"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"

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
	if err := userCollection.FindOne(ctx, bson.M{"_id": req.GetId()}).Decode(&u); err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "User has been not initialised")
	}

	q := question.Question{}
	var currentQuestion = len(u.AnsweredQuestions)
	questionCollection := database.Collection(os.Getenv("MONGODB_QUESTIONCOLLECTION"))
	if err := questionCollection.FindOne(ctx, bson.M{"questionNo": currentQuestion + 1}).Decode(&q); err != nil {
		return nil, status.Errorf(codes.PermissionDenied, "Invalid Question")
	}

	if q.Answer != req.GetAnswer() {
		return nil, status.Errorf(codes.InvalidArgument, "Wrong Answer")
	}

	var setUpdateFields bson.D
	var answeredQuestionArray = u.AnsweredQuestions
	var answerJSON = `{questionId:"ASd",answerTime:"sadf"}`
	var new user.QuestionsAnswered
	json.Unmarshal([]byte(answerJSON), &new)

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
