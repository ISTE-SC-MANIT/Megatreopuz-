package auth

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/twinj/uuid"
)

const accessDeadline = time.Minute * 15
const refreshDeadline = time.Hour * 24 * 7

//AccessDetails : Details for the access token
type AccessDetails struct {
	UUID             string
	Token            string
	Expires          int64
	ExpiresTimestamp time.Time
}

// CreateAccessToken : Function to create the access token
func CreateAccessToken(username string) (*AccessDetails, error) {
	id := uuid.NewV4().String()
	expiresStamp := time.Now().Add(accessDeadline)
	expires := expiresStamp.Unix()
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["uuid"] = id
	atClaims["username"] = username
	atClaims["exp"] = expires

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	return &AccessDetails{
		UUID:             id,
		Expires:          expires,
		Token:            token,
		ExpiresTimestamp: expiresStamp,
	}, nil
}

//RefreshDetails : Details for the refresh token
type RefreshDetails struct {
	UUID             string
	Token            string
	Expires          int64
	ExpiresTimestamp time.Time
}

// CreateRefreshToken : Function to create the refresh token
func CreateRefreshToken(username string) (*RefreshDetails, error) {
	id := uuid.NewV4().String()
	expiresStamp := time.Now().Add(refreshDeadline)
	expires := expiresStamp.Unix()
	rtClaims := jwt.MapClaims{}
	rtClaims["uuid"] = id
	rtClaims["username"] = username
	rtClaims["exp"] = expires

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	return &RefreshDetails{
		UUID:             id,
		Expires:          expires,
		Token:            token,
		ExpiresTimestamp: expiresStamp,
	}, nil
}
