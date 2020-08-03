package user

import (
	"firebase.google.com/go/v4/auth"
	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
)

// Server is typedef for user grpc server
type Server struct {
	MongoClient *mongo.Client
	RedisClient *redis.Client
	AuthClient  *auth.Client
}