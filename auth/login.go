package auth

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	user "github.com/ISTE-SC-MANIT/megatreopuz-mongo-structs/user"
	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"github.com/twinj/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

//AccessDetails  ...
type AccessDetails struct {
	AccessUUID string
	Username   string
}

//RefreshDetails ...
type RefreshDetails struct {
	RefreshUUID string
	Username    string
}

//TokenDetails is ...
type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUUID   string
	RefreshUUID  string
	AtExpires    int64
	RtExpires    int64
}

// Login : rpc called to login
func (s *Server) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}
	//Extracting data from requests
	username, password := req.GetUsername(), req.GetPassword()
	if password == "" {
		return nil, fmt.Errorf("User is not Registered locally")
	}

	//Calling to db
	usersCollection := s.MongoClient.Database("go").Collection("user")

	var result user.User

	//varifying wether user is in db
	err = usersCollection.FindOne(ctx, bson.M{"username": username}).Decode(&result)
	if err != nil {

		return nil, fmt.Errorf("Incorrect UserName")
	}

	//verifying password
	userPassword := *result.Password
	byteHash := []byte(userPassword)
	err = bcrypt.CompareHashAndPassword(byteHash, []byte(password))
	if err != nil {
		return nil, fmt.Errorf("Incorrect Password")
	}
	//createing Tokens
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	u := uuid.NewV4()
	m := uuid.NewV4()
	td.AccessUUID = u.String()
	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUUID = m.String()
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUUID
	atClaims["user_id"] = username
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		fmt.Println(err)
	}

	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUUID
	rtClaims["user_id"] = username
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		fmt.Println(err)
	}

	act := time.Unix(td.AtExpires, 0)
	rft := time.Unix(td.RtExpires, 0)
	now := time.Now()

	//saving to redis database
	errAccess := s.RedisClient.Set(s.RedisClient.Context(), td.AccessUUID, username, act.Sub(now)).Err()
	if errAccess != nil {
		return nil, errAccess
	}
	errRefresh := s.RedisClient.Set(s.RedisClient.Context(), td.RefreshUUID, username, rft.Sub(now)).Err()
	if errRefresh != nil {
		return nil, errRefresh
	}

	return &proto.LoginResponse{
		AcessToken:   td.AccessToken,
		RefreshToken: td.RefreshToken,
	}, nil

}
