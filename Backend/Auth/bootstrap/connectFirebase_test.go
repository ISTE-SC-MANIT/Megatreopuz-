package bootstrap_test

import (
	"bytes"
	"log"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/bootstrap"
)

var _ = Describe("ConnectFirebase", func() {

	log.SetOutput(&bytes.Buffer{})

	It("Connects to firebase", func() {
		app, err := bootstrap.ConnectToFirebase()
		Expect(err).To(BeNil())
		Expect(app).ToNot(BeNil())
	})
})
