import { NextPage } from "next";
import React from "react";
import FormPage from "../../components/FormPage";
import SignUpLocalForm from "../../components/SignUp/localForm";
import firebase from "firebase/app";
import { useRouter } from "next/dist/client/router";
import { useCustomNotification } from "../../components/App/useNotification";

const SignUpPage: NextPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const showNotification = useCustomNotification();

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      router.push("/login");

      showNotification(
        "User was successfully Signed in, Please Login to continue",
        "success"
      );
    } catch (e) {
      showNotification("Something went wrong, Please try again later", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = () => {
    setLoading(true);

    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential;

        // The signed-in user info.
        const user = result.user;
        router.push("/login");

        showNotification(
          "User was successfully Signed in, Please Login to continue",
          "success"
        );

        // ...
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        showNotification(
          "Something went wrong, Please try again later",
          "error"
        );
        // ...
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <FormPage
      loading={loading}
      formID="local-sign-up"
      title="Sign up for Megatreopuz"
      submitLabel="Sign Up"
      googleButton={true}
      googleTitle="Sign Up with google"
      googleExec={onGoogleSignIn}
    >
      <SignUpLocalForm onSubmit={onSubmit} />
    </FormPage>
  );
};

export default SignUpPage;
