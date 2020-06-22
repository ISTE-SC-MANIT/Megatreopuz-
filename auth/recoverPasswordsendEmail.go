package auth

import (
	"context"
	"log"
	"net/smtp"
	"os"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/twinj/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

//SendPasswordRecoveryEmail ...
func (s *Server) SendPasswordRecoveryEmail(ctx context.Context, req *proto.SendPasswordRecoveryEmailRequest) (*proto.Empty, error) {
	clientEmail := req.GetEmail()
	if clientEmail == "" {
		return nil, status.Errorf(codes.InvalidArgument, "Email cannot be empty")

	}
	user, err := GetUserfromDatabaseByEmail(s.MongoContext, s.MongoClient, clientEmail)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "No user exists with email %s.", clientEmail)
	}
	redisContext, cancel := context.WithTimeout(s.RedisContext, Deadline)
	defer cancel()
	forgotPwID := uuid.NewV4().String()

	errPw := s.RedisClient.Set(redisContext, forgotPwID, user.Email, time.Now().Add(time.Minute*10).Sub(time.Now())).Err()
	if errPw != nil {
		return nil, status.Errorf(codes.Internal, errPw.Error())
	}

	auth := smtp.PlainAuth("", os.Getenv("SENDER_EMAIL"), os.Getenv("SENDER_EMAIL_PASSWORD"), os.Getenv("STMP_HOST"))
	to := []string{user.Email}
	msg := []byte(
		"Subject: Password recovery email for megatreopuz\r\n" +
			"Hi " + user.Name + "\r\n You recently requested to reset your password for your Megatreopuz Account.\r\nClick on the link below to reset your password.\r\nIf you have not requested then please ignore this email. Your password will be remained unchanged.\r\n This link is valid for only 10 minutes and can be used only once.\r\nPlease Don't reply,This is self generated mail\r\n Password reset Link ->" + "https://www.istemanit.in/" + forgotPwID + "\r\n Thanks\r\n Indian Society of Technical Education \r\n Student's Chapter MANIT")

	emailSendError := smtp.SendMail(os.Getenv("SMTP_ADDRESS"), auth, os.Getenv("SENDER_EMAIL"), to, msg)
	if emailSendError != nil {
		log.Printf(emailSendError.Error())
		return nil, status.Errorf(codes.Internal, emailSendError.Error())
	}
	return &proto.Empty{}, nil

}
