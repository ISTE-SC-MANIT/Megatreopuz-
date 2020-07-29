package user

import "go.mongodb.org/mongo-driver/bson/primitive"

// QuestionsAnswered holds the question-answer record
type QuestionsAnswered struct {
	QuestionID primitive.ObjectID `bson:"question_Id"`
	AnswerTime primitive.DateTime `bson:"answerTime"`
}

// User : The struct to map to user collection
type User struct {
	ID                primitive.ObjectID  `bson:"_id,omitempty"`
	Username          string              `bson:"username"`
	Name              string              `bson:"name"`
	Phone             string              `bson:"phone"`
	College           string              `bson:"college"`
	Country           string              `bson:"country"`
	Year              int                 `bson:"year"`
	Rank              int                 `bson:"rank"`
	MemberSince       primitive.DateTime  `bson:"memberSince"`
	AnsweredQuestions []QuestionsAnswered `bson:"answeredQuestions"`
}
