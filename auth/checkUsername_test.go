package auth_test

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"time"

	pb "github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/auth"
	"github.com/ISTE-SC-MANIT/megatreopuz-auth/bootstrap"
	"github.com/ISTE-SC-MANIT/megatreopuz-models/user"
	"github.com/bxcodec/faker/v3"
)

type dummyMongoClient struct {
}

func (d *dummyMongoClient) Count(ctx context.Context, field, value string) (int64, error) {
	switch value {
	case "validUsername":
		return 0, nil
	case "invalidUsername":
		return 1, nil
	default:
		return 0, fmt.Errorf("Cannot reach database")
	}
}

var _ = Describe("CheckUsername", func() {

	log.SetOutput(&bytes.Buffer{})

	Context("Unit test", func() {
		var server *auth.Server = &auth.Server{
			FirebaseApp: &auth.FirebaseAppWrapper{},
			MongoClient: &dummyMongoClient{},
		}

		It("Returns true for a non existing username", func() {

			res, err := server.CheckUsernameAvailability(context.Background(), &pb.CheckUsernameAvailabilityRequest{
				Username: "validUsername",
			})
			Expect(err).To(BeNil())
			Expect(res.GetAvailable()).To(Equal(true))
		})

		It("Returns false for an existing username", func() {

			res, err := server.CheckUsernameAvailability(context.Background(), &pb.CheckUsernameAvailabilityRequest{
				Username: "invalidUsername",
			})
			Expect(err).To(BeNil())
			Expect(res.GetAvailable()).To(Equal(false))
		})

		It("Returns proper message on error", func() {

			res, err := server.CheckUsernameAvailability(context.Background(), &pb.CheckUsernameAvailabilityRequest{
				Username: "dad",
			})
			Expect(res).To(BeNil())
			Expect(err).ToNot(BeNil())
			expectedError := status.Errorf(codes.Internal, "Error while interacting with database")
			Expect(err.Error()).To(Equal(expectedError.Error()))
		})
	})

	Context("Integration test", func() {

		var (
			client         *mongo.Client
			ctx            context.Context
			server         *auth.Server
			userCollection *mongo.Collection
			id             primitive.ObjectID
		)
		BeforeSuite(func() {
			id = primitive.NewObjectID()

			dummyUser := user.User{
				ID:                id,
				Name:              faker.UUIDHyphenated(),
				AnsweredQuestions: []user.QuestionsAnswered{},
				College:           faker.Word(),
				Country:           faker.Word(),
				CreatedAt:         primitive.NewDateTimeFromTime(time.Now()),
				UpdatedAt:         primitive.NewDateTimeFromTime(time.Now()),
				Phone:             faker.Word(),
				Rank:              0,
				Username:          "takenUsername",
				Year:              4,
			}

			ctx = context.Background()
			var err error
			client, err = bootstrap.ConnectToMongoDB()
			if err != nil {
				fmt.Println(err.Error())
				os.Exit(-1)
			}

			database := client.Database(os.Getenv("MONGODB_DATABASE"))
			userCollection = database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))
			_, err = userCollection.InsertOne(ctx, dummyUser)
			if err != nil {
				fmt.Println(err.Error())
				os.Exit(-1)
			}

			server = &auth.Server{
				MongoClient: &auth.MongoDBClientWrapper{client},
			}
		})

		It("Returns true for a non existing username", func() {
			res, err := server.CheckUsernameAvailability(ctx, &pb.CheckUsernameAvailabilityRequest{
				Username: "notTakenUsername",
			})

			Expect(err).To(BeNil())
			Expect(res).ToNot(BeNil())
			Expect(res.GetAvailable()).To(Equal(true))
		})

		It("Returns false for an existing username", func() {
			res, err := server.CheckUsernameAvailability(ctx, &pb.CheckUsernameAvailabilityRequest{
				Username: "takenUsername",
			})

			Expect(err).To(BeNil())
			Expect(res).ToNot(BeNil())
			Expect(res.GetAvailable()).To(Equal(false))
		})

		AfterSuite(func() {
			_, err := userCollection.DeleteOne(ctx, bson.M{
				"_id": id,
			})

			if err != nil {
				fmt.Println(err.Error())
				os.Exit(-1)
			}
			err = client.Disconnect(ctx)
			if err != nil {
				fmt.Println(err.Error())
				os.Exit(-1)
			}
		})
	})
})
