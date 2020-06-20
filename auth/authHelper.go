package auth

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/dgrijalva/jwt-go"
)

const (
	// Seconds field of the earliest valid Timestamp.
	// This is time.Date(1, 1, 1, 0, 0, 0, 0, time.UTC).Unix().
	minValidSeconds = -62135596800
	// Seconds field just after the latest valid Timestamp.
	// This is time.Date(10000, 1, 1, 0, 0, 0, 0, time.UTC).Unix().
	maxValidSeconds = 253402300800
)

//ExtractTokenMetadata : function to verify token  and extract redisID from it
func ExtractTokenMetadata(s string) (string, error) {
	// Validate the accesstoken recieved
	accesstoken, err := validateToken(s)
	if err != nil {
		return "", fmt.Errorf(`Error validating jwt accesstoken: %s`, err.Error())
	}

	// Check the claims
	claims, ok := accesstoken.Claims.(jwt.MapClaims)
	if ok && accesstoken.Valid {
		accessUUID, ok := claims["uuid"].(string)
		if !ok {
			return "", fmt.Errorf(`Cannot parse accesstoken uuid:  %s`, err.Error())
		}
		return accessUUID, nil
	}
	return "", err
}

//ExtractTokenMetadataUserName : function to verify token  and extract username from it
func ExtractTokenMetadataUserName(s string) (string, error) {
	// Validate the accesstoken recieved
	accesstoken, err := validateToken(s)
	if err != nil {
		return "", fmt.Errorf(`Error validating jwt accesstoken: %s`, err.Error())
	}

	// Check the claims
	claims, ok := accesstoken.Claims.(jwt.MapClaims)
	if ok && accesstoken.Valid {
		username, ok := claims["username"].(string)
		if !ok {
			return "", fmt.Errorf(`Cannot parse accesstoken uuid:  %s`, err.Error())
		}
		return username, nil
	}
	return "", err
}

//ValidateToken : function to verify token
func ValidateToken(tokenString string) (*jwt.Token, error) {
	accesstoken, err := jwt.Parse(tokenString, func(accesstoken *jwt.Token) (interface{}, error) {

		if _, ok := accesstoken.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", accesstoken.Header["alg"])
		}

		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return accesstoken, nil
}
func validateTimestamp(ts *proto.Timestamp) error {
	if ts == nil {
		return errors.New("timestamp: nil Timestamp")
	}
	if ts.Seconds < minValidSeconds {
		return fmt.Errorf("timestamp: %v before 0001-01-01", ts)
	}
	if ts.Seconds >= maxValidSeconds {
		return fmt.Errorf("timestamp: %v after 10000-01-01", ts)
	}
	if ts.Nanos < 0 || ts.Nanos >= 1e9 {
		return fmt.Errorf("timestamp: %v: nanos not in range [0, 1e9)", ts)
	}
	return nil
}

//TimestampProto : timestamp conversion
func TimestampProto(t time.Time) (*proto.Timestamp, error) {
	ts := &proto.Timestamp{
		Seconds: t.Unix(),
		Nanos:   int32(t.Nanosecond()),
	}
	if err := validateTimestamp(ts); err != nil {
		return nil, err
	}
	return ts, nil
}
