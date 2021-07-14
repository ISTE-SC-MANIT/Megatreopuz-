package auth

import firebase "firebase.google.com/go/v4"

// FirebaseInteraction controls interaction with firebase
type FirebaseInteraction interface {
}

// FirebaseAppWrapper is for injecting the firebase functionality in the client
type FirebaseAppWrapper struct {
	App *firebase.App
}
