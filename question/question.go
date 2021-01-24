package question

// Question : The struct to map to question collection
type Question struct {
	ID         string `bson:"_id,omitempty"`
	Answer     string `bson:"answer"`
	QuestionNo int    `bson:"questionNo"`
	ImageUrl   string `bson:"imgUrl"`
}
