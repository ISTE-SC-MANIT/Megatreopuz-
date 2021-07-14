import { NextPage } from "next";
import React, { useState } from "react";
import FormPage from "../../components/FormPage";
import SignUpForm from "../../components/SignUp/form";
import { makeResolvable } from "../../components/resolvablePromise";
import {
  graphql,
  fetchQuery,
  useRelayEnvironment,
  useMutation,
} from "relay-hooks";
import { completeDetailsUsernameCheckQuery } from "../../__generated__/completeDetailsUsernameCheckQuery.graphql";
import { completeDetailsCreateUserMutation } from "../../__generated__/completeDetailsCreateUserMutation.graphql";
import { useRouter } from "next/dist/client/router";
import { useCustomNotification } from "../../components/App/useNotification";

const query = graphql`
  query completeDetailsUsernameCheckQuery($username: String!) {
    checkUsername(username: $username) {
      available
    }
  }
`;

const mutation = graphql`
  mutation completeDetailsCreateUserMutation($input: UserCreateInput!) {
    createLocalUser(input: $input) {
      successful
    }
  }
`;

const SignUpPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const env = useRelayEnvironment();
  const [mutate] = useMutation<completeDetailsCreateUserMutation>(mutation);
  const router = useRouter();
  const showNotification = useCustomNotification();
  const promiseMaker = React.useMemo(() => {
    return (username: string) =>
      makeResolvable<{ available: boolean; username: string }>(
        (resolve, reject) => {
          setDisabled(true);
          fetchQuery<completeDetailsUsernameCheckQuery>(
            env,
            query,
            {
              username,
            },
            {
              force: true,
            }
          )
            .then((output) => {
              resolve({
                username,
                available: output.checkUsername.available,
              });
            })
            .catch(reject)
            .finally(() => setDisabled(false));
        }
      );
  }, [env]);

  return (
    <FormPage
      disableSubmit={disabled}
      loading={loading}
      formID="complete-details-form"
      title="Sign up"
      submitLabel="Sign Up"
    >
      <SignUpForm
        formProps={{
          id: "complete-details-form",
        }}
        usernameCheck={promiseMaker}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const result = await mutate({
              variables: {
                input: {
                  college: values.college,
                  country: values.country.label,
                  name: values.name,
                  phone: values.phone,
                  username: values.username,
                  year: values.year,
                },
              },
            });

            if (result.createLocalUser.successful) {
              router.push("/dashboard");
            }
          } catch (e) {
            showNotification("Unable to create Player", "error");
          } finally {
            setLoading(false);
          }
        }}
      />
    </FormPage>
  );
};

export default SignUpPage;
