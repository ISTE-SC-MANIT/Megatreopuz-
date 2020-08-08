package bootstrap

import (
	"context"
	"log"
	"net"
	"os"

	proto "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
	"github.com/ISTE-SC-MANIT/megatreopuz-user/user"

	
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

// Start function starts up the server
func Start() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	app, err := ConnectToFirebase()

	if err != nil {
		log.Fatalf("error initialising firebase app: %v", err)
	}

	client, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("error connecting to firebase user: %v", err)
	}
	mongo, err := ConnectToMongoDB()

	log.Print(`Pinging MongoDB`)

	// Test the mongoDB connection
	err = mongo.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Print(`Pinged MongoDB successfully`)

	// Connect to redis
	// redisClient := redis.NewClient(&redis.Options{
	// 	Addr:     os.Getenv("REDIS_ADDRESS"),
	// 	Password: os.Getenv("REDIS_PASSWORD"),
	// })

	// log.Print(`Connecting to Redis`)
	// // Test the redis connection
	// _, err = redisClient.Ping(context.Background()).Result()
	// if err != nil {
	// 	log.Fatalf("Ran into an error while connecting to Redis: %v", err.Error())
	// }
	// log.Print(`Pinged Redis successfully`)

	// Start a tcp listener on given port
	port := os.Getenv("PORT")
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Cannot listen on tcp port: %v. Error: %v", port, err.Error())
	}

	// Make a gRPC server
	grpcServer := grpc.NewServer()

	proto.RegisterUserServiceServer(grpcServer, &user.Server{
		// RedisClient: redisClient,
		MongoClient: mongo,
		AuthClient:  client,
	})

	log.Print("Listening on port ", port)
	log.Print("Starting gRPC server")
	// Attach gRPC server to the listener
	err = grpcServer.Serve(lis)

	if err != nil {
		log.Fatalf("Could not start gRPC server. Error: %v", err.Error())
	}

}
