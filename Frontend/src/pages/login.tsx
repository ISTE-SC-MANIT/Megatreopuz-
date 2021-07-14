import React from "react";
import { NextPage } from "next";
import FormPage from "../components/FormPage";
import LoginForm from "../components/Login/form";
import firebase from "firebase/app";
import { graphql, useMutation } from "relay-hooks";
import { loginMutation } from "../__generated__/loginMutation.graphql";
import { useRouter } from "next/dist/client/router";
import { useCustomNotification } from "../components/App/useNotification";
import cookie from "js-cookie";
import LinearLoader from "../components/App/LinearLoader";
// import Loader from "../components/App/Loader";

const mutation = graphql`
  mutation loginMutation($idToken: String!) {
    createUserSession(idToken: $idToken) {
      initialised
      cookie
    }
  }
`;

const Login: NextPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [mutate] = useMutation<loginMutation>(mutation);
  const router = useRouter();
  const showNotification = useCustomNotification();

  // TODO: Check the state of the user : logged in or out?
  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      //TODO: EMAIL VERIFICATION
      // if (!result.user.emailVerified) {
      //     showNotification("Please verify Your email to continue", "error")
      //     return
      // };
      const id = await result.user.getIdToken();
      redirectUser(id);
    } catch (e) {
      console.error(e);
      showNotification("Invalid Login Credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = firebase.auth().signInWithPopup(provider);
    const id = await (await result).user.getIdToken();
    redirectUser(id);
  };

  const redirectUser = async (idToken: string) => {
    const mutationResult = await mutate({
      variables: {
        idToken: idToken,
      },
    });
    cookie.remove("authorization");

    cookie.set("authorization", mutationResult.createUserSession.cookie, {
      // expires: 6.048e8,
      // sameSite: "strict"
    });

    if (mutationResult.createUserSession.initialised) {
      showNotification("User was Successfully Logged In", "success");
      router.push("/dashboard");
    } else router.push("/signup/completeDetails");
    setLoading(false);
  };

  return (
    <>
      <LinearLoader loading={loading} />

      <FormPage
        loading={loading}
        title="Log in to Megatreopuz"
        formID="login-form"
        submitLabel="Login"
        googleButton
        googleExec={onGoogleLogin}
        googleTitle={"Login With Google"}
      >
        <LoginForm onSubmit={onSubmit} />
      </FormPage>
    </>
  );
};

export default Login;
