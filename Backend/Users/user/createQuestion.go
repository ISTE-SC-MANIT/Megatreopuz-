package user

import (
	"context"
	"fmt"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/question"

	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
)

// CreateQuestion is the rpc to create a question
func (s *Server) CreateQuestion(ctx context.Context, req *pb.CreateQuestionRequest) (*pb.Empty, error) {
	var err error
	// u := user.User{
	// 	ID:                decoded.UID,
	// 	AnsweredQuestions: []user.QuestionsAnswered{},
	// 	College:           req.GetCollege(),
	// 	CreatedAt:         primitive.NewDateTimeFromTime(time.Now()),
	// 	UpdatedAt:         primitive.NewDateTimeFromTime(time.Now()),
	// 	Country:           req.GetCountry(),
	// 	Name:              req.GetName(),
	// 	Phone:             req.GetPhone(),
	// 	Rank:              0,
	// 	Username:          req.GetUsername(),
	// 	Year:              int(req.GetYear()),
	// }

	u := question.Question{
		Answer:     req.GetAnswer(),
		QuestionNo: int(req.GetQuestionNo()),
		ImageUrl:   req.GetImgUrl(),
	}
	fmt.Println(u)

	database := s.MongoClient.Database(os.Getenv("MONGODB_DATABASE"))
	questionCollection := database.Collection(os.Getenv("MONGODB_QUESTIONCOLLECTION"))
	_, err = questionCollection.InsertOne(ctx, u)
	if err != nil {
		fmt.Println(err)
		return nil, status.Errorf(codes.Internal, "database refused to create user")
	}
	return &pb.Empty{}, nil
}
