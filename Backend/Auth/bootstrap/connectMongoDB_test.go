package bootstrap_test

import (
	"bytes"
	"log"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/bootstrap"
)

var _ = Describe("ConnectMongoDB", func() {
	log.SetOutput(&bytes.Buffer{})

	It("Connects to firebase", func() {
		client, err := bootstrap.ConnectToMongoDB()
		Expect(err).To(BeNil())
		Expect(client).ToNot(BeNil())
	})
})
