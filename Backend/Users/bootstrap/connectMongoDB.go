package bootstrap

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ConnectToMongoDB connects to mongoDB
func ConnectToMongoDB() (*mongo.Client, error) {
	log.Println("Creating a mongodb client")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_ADDRESS")))

	if err != nil {
		return nil, fmt.Errorf("error connecting to mongodb: %v", err)
	}

	return client, nil
}
