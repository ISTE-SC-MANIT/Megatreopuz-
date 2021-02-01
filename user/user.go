package user

import "go.mongodb.org/mongo-driver/bson/primitive"

// QuestionsAnswered holds the question-answer record
type QuestionsAnswered struct {
	QuestionID string `bson:"question_Id"`
	AnswerTime string `bson:"answerTime"`
	QuestionNo int    `bson:"questionNo"`
}

// User : The struct to map to user collection
type User struct {
	ID                string              `bson:"_id,omitempty"`
	Username          string              `bson:"username"`
	Name              string              `bson:"name"`
	Phone             string              `bson:"phone"`
	College           string              `bson:"college"`
	Country           string              `bson:"country"`
	Year              int                 `bson:"year"`
	TotalAttempts     int                 `bson:"attempts"`
	Rank              int                 `bson:"rank"`
	CreatedAt         primitive.DateTime  `bson:"createdAt"`
	UpdatedAt         primitive.DateTime  `bson:"updatedAt"`
	AnsweredQuestions []QuestionsAnswered `bson:"answeredQuestions"`
}
