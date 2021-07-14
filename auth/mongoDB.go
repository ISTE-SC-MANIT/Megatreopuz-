package auth

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// MongoDBInteraction controls interaction with mongoDB
type MongoDBInteraction interface {
	Count(ctx context.Context, field string, value string) (int64, error)
}

// MongoDBClientWrapper is for injecting the mongoDB functionality in the client
type MongoDBClientWrapper struct {
	Client *mongo.Client
}

// Count counts the records having the field - value pair
func (c *MongoDBClientWrapper) Count(ctx context.Context, field, value string) (int64, error) {
	database := c.Client.Database(os.Getenv("MONGODB_DATABASE"))
	userCollection := database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))

	m := bson.M{}
	m[field] = value
	count, err := userCollection.CountDocuments(ctx, m)

	if err != nil {
		return 0, err
	}
	return count, nil
}
