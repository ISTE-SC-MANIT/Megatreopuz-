package auth

import (
	"context"
	"os"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/ISTE-SC-MANIT/megatreopuz-mongo-structs/user"
	"github.com/dgrijalva/jwt-go"
	"github.com/golang/protobuf/ptypes"
	"github.com/twinj/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

//AccessDetails : Details for the access token
type AccessDetails struct {
	AccessUUID string
	Username   string
}

//RefreshDetails : Details of the refersh token
type RefreshDetails struct {
	RefreshUUID string
	Username    string
}

// Login : rpc called to login
func (s *Server) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {

	// Extracting data from requests
	username, password := req.GetUsername(), req.GetPassword()
	if password == "" {
		return nil, status.Errorf(codes.NotFound,
			"User is not registered locally. Try signing in using google")
	}

	// Getting user form the database
	mongoCtx, cancel := context.WithTimeout(s.MongoContext, time.Second*10)
	defer cancel()
	var result user.User
	err := s.MongoClient.Database("go").Collection("user").FindOne(mongoCtx, bson.M{"username": username}).Decode(&result)
	if err != nil {
		return nil, status.Errorf(codes.NotFound,
			"Username %s is not registered.", username)
	}

	// Verifying password
	err = bcrypt.CompareHashAndPassword([]byte(*result.Password), []byte(password))
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated,
			"Incorrect password")
	}
	// Createing tokens
	AtExpires := time.Now().Add(time.Minute * 15).Unix()
	u := uuid.NewV4()
	m := uuid.NewV4()
	AccessUUID := u.String()
	RtExpires := time.Now().Add(time.Hour * 24 * 7).Unix()
	RefreshUUID := m.String()
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = AccessUUID
	atClaims["user_id"] = username
	atClaims["exp"] = AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	AccessToken, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Signing access token failed.")
	}

	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = RefreshUUID
	rtClaims["user_id"] = username
	rtClaims["exp"] = RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	RefreshToken, err := rt.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Signing refresh token failed.")
	}

	act := time.Unix(AtExpires, 0)
	rft := time.Unix(RtExpires, 0)
	now := time.Now()

	//saving to redis database
	errAccess := s.RedisClient.Set(s.RedisClient.Context(), AccessUUID, username, act.Sub(now)).Err()
	if errAccess != nil {
		return nil, status.Errorf(codes.Internal, "Entry of access token to redis failed.")
	}
	errRefresh := s.RedisClient.Set(s.RedisClient.Context(), RefreshUUID, username, rft.Sub(now)).Err()
	if errRefresh != nil {
		return nil, status.Errorf(codes.Internal, "Entry of refresh token to reddis failed.")
	}

	accessExpiryProto, err := ptypes.TimestampProto(act)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Invalid access token expiration time")
	}

	refreshExpiryProto, err := ptypes.TimestampProto(act)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Invalid refresh token expiration time")
	}
	return &proto.LoginResponse{
		AcessToken:         AccessToken,
		RefreshToken:       RefreshToken,
		AccessTokenExpiry:  accessExpiryProto,
		RefreshTokenExpiry: refreshExpiryProto,
	}, nil

}
