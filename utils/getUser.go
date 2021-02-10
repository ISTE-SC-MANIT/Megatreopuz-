package utils

import (
	"context"
	"fmt"

	"firebase.google.com/go/v4/auth"
	"google.golang.org/grpc/metadata"
)

// GetUserFromFirebase takes grpc metadata and fetches the user from firebase
func GetUserFromFirebase(ctx context.Context, a *auth.Client) (*auth.Token, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("not able to extract metadata")
	}
	accessTokenSlice, ok := md["authorization"]
	if !ok {
		return nil, fmt.Errorf("invalid access token")
	}

	value := accessTokenSlice[0]
	fmt.Println(value)
	decoded, err := a.VerifySessionCookieAndCheckRevoked(ctx, value)
	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("cookie could not be verified")
	}

	return decoded, nil
}
