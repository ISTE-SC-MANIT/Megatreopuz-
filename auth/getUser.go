package auth

import (
	"context"
	"os"

	"github.com/ISTE-SC-MANIT/megatreopuz-mongo-structs/user"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetUserfromDatabase : Gets a user from mongodb
func GetUserfromDatabase(ctx context.Context, client *mongo.Client, username string) (*user.User, error) {
	mongoCtx, cancel := context.WithTimeout(ctx, Deadline)
	defer cancel()
	result := &user.User{}
	err := client.Database(os.Getenv("MONGODB_DATABASE")).Collection(os.Getenv("MONGODB_USERCOLLECTION")).FindOne(mongoCtx, bson.M{"username": username}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// GetUserfromDatabaseByEmail : Getting user from database using email
func GetUserfromDatabaseByEmail(ctx context.Context, client *mongo.Client, email string) (*user.User, error) {
	mongoCtx, cancel := context.WithTimeout(ctx, Deadline)
	defer cancel()
	result := &user.User{}
	err := client.Database(os.Getenv("MONGODB_DATABASE")).Collection(os.Getenv("MONGODB_USERCOLLECTION")).FindOne(mongoCtx, bson.M{"email": email}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
