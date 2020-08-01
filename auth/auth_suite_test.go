package auth_test

import (
	"log"
	"testing"

	"github.com/joho/godotenv"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestAuth(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	RegisterFailHandler(Fail)
	RunSpecs(t, "Auth Suite")
}
