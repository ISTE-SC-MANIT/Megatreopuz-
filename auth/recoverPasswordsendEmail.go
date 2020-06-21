package auth

import (
	"context"
	"log"
	"net/smtp"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/twinj/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) RecoverPasswordSendEmail(ctx context.Context, req *proto.PasswordRecoverySendEmailRequest) (*proto.PasswordRecoverySendEmailResponse, error) {
	clientEmail := req.GetEmail()
	user, err := GetUserfromDatabaseByEmail(s.MongoContext, s.MongoClient, clientEmail)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "No user exists with email %s.", clientEmail)
	}
	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()
	forgotPwID := uuid.NewV4().String()

	errPw := s.RedisClient.Set(redisContext, forgotPwID, user.ID.String(), time.Now().Add(time.Minute*10).Sub(time.Now())).Err()
	if errPw != nil {
		return nil, status.Errorf(codes.Internal, errPw.Error())
	}

	auth := smtp.PlainAuth("", "kdevanshsharma23@gmail.com", "iitmumbai", "smtp.gmail.com")
	to := []string{user.Email}
	msg := []byte("To:" + user.Email +
		"Subject: Password recovery email for megatreopuz\r\n" +
		"\r\n" +
		"Here’s the space for our great sales pitch\r\n")

	emailSendError := smtp.SendMail("smtp.gmail.com:587", auth, "kdevanshsharma23@gmail.com", to, msg)
	if emailSendError != nil {
		log.Printf(emailSendError.Error())
		return nil, status.Errorf(codes.Internal, emailSendError.Error())
	}
	return &proto.PasswordRecoverySendEmailResponse{IsEmailSent: true}, nil

}
