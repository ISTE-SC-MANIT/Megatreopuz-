package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/twinj/uuid"
	"google.golang.org/grpc/metadata"
)

const accessDeadline = time.Minute * 15
const refreshDeadline = time.Hour * 24 * 7
const refreshTokenKeyInMetata = "refresh"
const accessTokenKeyInMetata = "authorization"
const refreshTokenUsernameClaim = "username"
const accessTokenUsernameClaim = "username"
const accessTokenIDClaim = "uuid"
const refreshTokenIDClaim = "uuid"

//AccessToken : Details for the access token
type AccessToken struct {
	UUID             string
	Token            string
	Expires          int64
	ExpiresTimestamp time.Time
}

// CreateAccessToken : Function to create the access token
func CreateAccessToken(username string) (*AccessToken, error) {
	id := uuid.NewV4().String()
	expiresStamp := time.Now().Add(accessDeadline)
	expires := expiresStamp.Unix()
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims[accessTokenIDClaim] = id
	atClaims[accessTokenUsernameClaim] = username
	atClaims["exp"] = expires

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	return &AccessToken{
		UUID:             id,
		Expires:          expires,
		Token:            token,
		ExpiresTimestamp: expiresStamp,
	}, nil
}

//RefreshToken : Details for the refresh token
type RefreshToken struct {
	UUID             string
	Token            string
	Expires          int64
	ExpiresTimestamp time.Time
}

// CreateRefreshToken : Function to create the refresh token
func CreateRefreshToken(username string) (*RefreshToken, error) {
	id := uuid.NewV4().String()
	expiresStamp := time.Now().Add(refreshDeadline)
	expires := expiresStamp.Unix()
	rtClaims := jwt.MapClaims{}
	rtClaims[refreshTokenIDClaim] = id
	rtClaims[refreshTokenUsernameClaim] = username
	rtClaims["exp"] = expires

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	return &RefreshToken{
		UUID:             id,
		Expires:          expires,
		Token:            token,
		ExpiresTimestamp: expiresStamp,
	}, nil
}

// RefreshTokenParsed : Refresh token information gained from metadata
type RefreshTokenParsed struct {
	UUID, Username string
}

// AccessTokenParsed : Access token information gained from metadata
type AccessTokenParsed struct {
	UUID, Username string
}

// MetadataInfo : Information extracted from gRPC metadata
type MetadataInfo struct {
	Refresh RefreshTokenParsed
	Access  *AccessTokenParsed
}

// ExtractTokensFromMetata : Function to extract the tokens from metadata
func ExtractTokensFromMetata(md metadata.MD) (*MetadataInfo, error) {
	refresh, ok := md[refreshTokenKeyInMetata]

	// No tokens in metadata
	if !ok {
		return nil, nil
	}

	// Invalid refresh token
	if len(refresh) == 0 {
		return nil, fmt.Errorf("Invalid refresh token in context")
	}

	// parse the tokens
	refreshParsed, err := parseJWTToken((refresh[0]))
	if err != nil {
		return nil, fmt.Errorf("Cannot parse refresh token: %s", err.Error())
	}

	claims, ok := refreshParsed.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("Refresh token does not contain valid claims")
	}

	refreshUsername, ok := claims[refreshTokenUsernameClaim].(string)
	if !ok {
		return nil, fmt.Errorf("Refresh token does not contain username")
	}
	refreshUUID, ok := claims[refreshTokenIDClaim].(string)
	if !ok {
		return nil, fmt.Errorf("Refresh token does not contain uuid")
	}

	refreshReturnValue := RefreshTokenParsed{
		UUID:     refreshUUID,
		Username: refreshUsername,
	}

	access, ok := md[accessTokenKeyInMetata]

	// No access token in metadata
	if !ok {
		return &MetadataInfo{
			Refresh: refreshReturnValue,
		}, nil
	}

	// Invalid access token
	if len(access) == 0 {
		return nil, fmt.Errorf("Invalid access token in context")
	}

	accessParsed, err := parseJWTToken((access[0]))
	if err != nil {
		return nil, fmt.Errorf("Cannot parse access token: %s", err.Error())
	}
	claims, ok = accessParsed.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("Access token does not contain valid claims")
	}

	accessUsername, ok := claims[accessTokenUsernameClaim].(string)
	if !ok {
		return nil, fmt.Errorf("Access token does not contain username")
	}
	accessUUID, ok := claims[accessTokenIDClaim].(string)
	if !ok {
		return nil, fmt.Errorf("Access token does not contain uuid")
	}

	return &MetadataInfo{
		Refresh: refreshReturnValue,
		Access: &AccessTokenParsed{
			UUID:     accessUUID,
			Username: accessUsername,
		},
	}, nil
}

func parseJWTToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("Invalid token")
	}

	return token, nil
}
