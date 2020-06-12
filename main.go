package main

import (
	"context"
	"log"
	"net"
	"os"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/auth"
	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
)

func main() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	log.Print(`Connecting to MongoDB`)
	// Set mongoDB context
	mongoCtx := context.Background()

	// Connect to MongoDB
	mongoClient, err := mongo.Connect(mongoCtx, options.Client().ApplyURI(
		os.Getenv("MONGODB_ADDRESS"),
	))
	// Check for connection errors
	if err != nil {
		log.Fatalf("Ran into an error while connecting to MongDB: %v", err.Error())
	}

	log.Print(`Pinging MongoDB`)

	// Test the mongoDB connection
	err = mongoClient.Ping(mongoCtx, nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Print(`Pinged MongoDB successfully`)

	// Connect to redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDRESS"),
		Password: os.Getenv("REDIS_PASSWORD"),
	})

	// Make a redis context
	redisCtx := context.Background()

	log.Print(`Connecting to Redis`)
	// Test the redis connection
	_, err = redisClient.Ping(redisCtx).Result()
	if err != nil {
		log.Fatalf("Ran into an error while connecting to Redis: %v", err.Error())
	}
	log.Print(`Pinged Redis successfully`)

	// Start a tcp listener on given port
	port := os.Getenv("PORT")
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Cannot listen on tcp port: %v. Error: %v", port, err.Error())
	}

	// Make a gRPC server
	grpcServer := grpc.NewServer()
	proto.RegisterAuthServiceServer(grpcServer, &auth.Server{
		MongoClient:  mongoClient,
		MongoContext: mongoCtx,
		RedisClient:  redisClient,
		RedisContext: redisCtx,
	})

	log.Print("Listening on port ", port)
	log.Print("Starting gRPC server")
	// Attach gRPC server to the listener
	err = grpcServer.Serve(lis)

	if err != nil {
		log.Fatalf("Could not start gRPC server. Error: %v", err.Error())
	}

}
