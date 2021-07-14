package bootstrap

import (
	"context"
	"fmt"
	"log"
	"time"

	firebase "firebase.google.com/go/v4"
)

// ConnectToFirebase connects to firebase
func ConnectToFirebase() (*firebase.App, error) {
	log.Println("Creating a firebase app")

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("error initializing firebase app: %v", err)
	}

	return app, nil
}
