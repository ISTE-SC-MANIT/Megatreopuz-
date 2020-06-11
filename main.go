package main

import (
	"context"
	"log"
	"net"
	"os"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/auth"
	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
)

const deadline = 10 * time.Second

func main() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	log.Print(`Connecting to MongoDB`)
	// Connect to mongoDB
	mongoCtx, mongoCancel := context.WithTimeout(context.Background(), deadline)
	defer mongoCancel()
	mongoClient, err := mongo.Connect(mongoCtx, options.Client().ApplyURI(
		os.Getenv("MONGODB_ADDRESS"),
	))
	if err != nil {
		log.Fatalf("Ran into an error while connecting to MongDB: %v", err.Error())
	}
	log.Print(`Connected to MongoDB successfully`)

	log.Print(`Pinging MongoDB successfully`)
	// Test the mongoDB connection
	err = mongoClient.Ping(mongoCtx, nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Print(`Pinged MongoDB successfully`)

	// Defer closing the connection
	defer mongoClient.Disconnect(mongoCtx)

	// Connect to redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDRESS"),
		Password: os.Getenv("REDIS_PASSWORD"),
	})

	// Make a redis context
	redisCtx, redisCancel := context.WithTimeout(context.Background(), deadline)
	defer redisCancel()

	log.Print(`Connecting to Redis`)
	// Test the redis connection
	_, err = redisClient.Ping(redisCtx).Result()
	if err != nil {
		log.Fatalf("Ran into an error while connecting to Redis: %v", err.Error())
	}
	log.Print(`Pinged Redis successfully`)

	port := os.Getenv("PORT")
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Cannot listen on tcp port: %v. Error: %v", port, err.Error())
	}

	grpcServer := grpc.NewServer()
	proto.RegisterAuthServiceServer(grpcServer, &auth.Server{
		MongoClient:  mongoClient,
		MongoContext: mongoCtx,
		RedisClient:  redisClient,
		RedisContext: redisCtx,
	})

	log.Print("Listening on ", port)
	log.Print("Starting gRPC server")
	err = grpcServer.Serve(lis)

	if err != nil {
		log.Fatalf("Could not start gRPC server. Error: %v", err.Error())
	}

}
