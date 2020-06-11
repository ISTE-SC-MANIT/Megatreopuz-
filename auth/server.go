package auth

import (
	"context"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
)

// Server : gRPC server for Auth service
type Server struct {
	MongoClient  *mongo.Client
	RedisClient  *redis.Client
	RedisContext context.Context
	MongoContext context.Context
}
