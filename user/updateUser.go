package user

import (
	"context"

	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/ISTE-SC-MANIT/megatreopuz-models/utils"
	pb "github.com/ISTE-SC-MANIT/megatreopuz-user/protos"
)

//UpdateLocalPlayer is the rpc to update a local player's entry
func (s *Server) UpdateLocalPlayer(ctx context.Context, req *pb.UpdateLocalPlayerRequest) (*pb.Empty, error) {
	decoded, err := utils.GetUserFromFirebase(ctx, s.AuthClient)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "Could not identify the user")
	}

	var setUpdateFields bson.D
	if len(req.GetCollege()) > 0 {
		setUpdateFields = append(setUpdateFields, bson.E{Key: "college", Value: req.GetCollege()})
	}
	if len(req.GetUsername()) > 0 {
		setUpdateFields = append(setUpdateFields, bson.E{Key: "username", Value: req.GetUsername()})
	}
	if len(req.GetName()) > 0 {
		setUpdateFields = append(setUpdateFields, bson.E{Key: "name", Value: req.GetName()})
	}
	if len(req.GetPhone()) > 0 {
		setUpdateFields = append(setUpdateFields, bson.E{Key: "phone", Value: req.GetPhone()})
	}
	if len(req.GetCountry()) > 0 {
		setUpdateFields = append(setUpdateFields, bson.E{Key: "country", Value: req.GetCountry()})
	}

	if int(req.GetYear()) > 0 {
		setUpdateFields = append(setUpdateFields, bson.E{Key: "year", Value: int(req.GetYear())})
	}

	database := s.MongoClient.Database(os.Getenv("MONGODB_DATABASE"))
	userCollection := database.Collection(os.Getenv("MONGODB_USERCOLLECTION"))
	_, updateErr := userCollection.UpdateOne(ctx, bson.D{
		primitive.E{Key: "_id", Value: decoded.UID},
	},
		bson.D{
			primitive.E{Key: "$set", Value: setUpdateFields},
		})
	if updateErr != nil {
		return nil, status.Errorf(codes.Internal, "database refused to update user")
	}

	return &pb.Empty{}, nil
}
