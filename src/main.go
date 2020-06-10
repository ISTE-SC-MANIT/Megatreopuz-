package main

import (
	"fmt"

	"github.com/ISTE-SC-MANIT/megatreopuz-auth/proto"
)

func main() {
	fmt.Println(`Hello world`)
	fmt.Println(proto.LoginRequest{
		Password: "xxxxx",
		Username: "xxxxx",
	})
}
