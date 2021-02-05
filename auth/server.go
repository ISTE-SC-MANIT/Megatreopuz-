package auth

import (
	"firebase.google.com/go/v4/auth"
	// "github.com/go-redis/redis/v8"
)

// Server is struct for the auth grpc server
type Server struct {
	FirebaseApp FirebaseInteraction
	MongoClient MongoDBInteraction
	AuthClient  *auth.Client
	// RedisClient *redis.Client
}
