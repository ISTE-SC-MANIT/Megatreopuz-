package auth

import (
	"context"
	"net/smtp"
	"os"
	"strings"
	"text/template"
	"time"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
	"github.com/twinj/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const maxMailMessageSize = 700

//SendPasswordRecoveryEmail : rpc to send mail to the user
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

	tmpl, err := template.New("test").Parse(`Subject: Password recovery email for Megatreopuz

	Hi {{.Name}},

	You recently requested to reset your password for your Megatreopuz Account. If you did not make this request, please ignore this email.
	Click on the link below to reset your password. This link is valid for only 10 minutes and can be used only once. This is self generated mail.
	
		Password reset Link: {{.URL}}/resetPassword?code={{.ID}}
	
	Thanks
	Indian Society of Technical Education
	Student's Chapter MANIT
	`)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error generating mail message: %s", err.Error())
	}

	var buff strings.Builder
	buff.Grow(maxMailMessageSize)

	tmpl.Execute(&buff, struct {
		Name, URL, ID string
	}{
		Name: user.Name,
		URL:  os.Getenv("MEGATREOPUZ_URL"),
		ID:   forgotPwID,
	})

	msg := []byte(buff.String())

	emailSendError := smtp.SendMail(os.Getenv("SMTP_ADDRESS"), auth, os.Getenv("SENDER_EMAIL"), to, msg)
	if emailSendError != nil {
		return nil, status.Errorf(codes.Internal, emailSendError.Error())
	}
	return &proto.Empty{}, nil

}
