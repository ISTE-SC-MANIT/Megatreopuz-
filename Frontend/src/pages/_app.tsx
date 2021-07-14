import React from "react";
import { AppProps } from "next/app";
import AppWrapper from "../components/App/AppWrapper";
import {
  graphql,
  useRelayEnvironment,
  RelayEnvironmentProvider,
} from "relay-hooks";
import { useIsUserLoggedIn } from "./../utils";
import { Environment, QueryRenderer } from "react-relay";
import {
  AppWrapperQuery,
  AppWrapperQueryResponse,
} from "../__generated__/AppWrapperQuery.graphql";
import { useRouter } from "next/dist/client/router";
import { makeEnvironment } from "../components/Relay/environment";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Loader from "../components/App/Loader";
import { useCustomNotification } from "../components/App/useNotification";

export const query = graphql`
  query AppWrapperQuery {
    getPlayer {
      id
      userName
      email
      year
      college
      country
      phone
      name
      solvedQuestions
      totalAttempts
    }
  }
`;

export interface ProtectedPageProps extends AppProps {
  viewer: AppWrapperQueryResponse["getPlayer"];
  refetch: () => void;
}

function CustomApp(props: AppProps): React.ReactElement {
  const { Component, pageProps } = props;

  const router = useRouter();
  const paths = router.route.split("/");
  const first = paths[1];
  const second = paths[2];
  console.log(first);

  const [loading, setLoading] = React.useState<boolean>(false);
  const showNotification = useCustomNotification();
  const environment: Environment | null = React.useMemo(() => {
    if (first === "dashboard" || "login") return makeEnvironment();
    return null;
  }, [first, second]);

  return (
    <AppWrapper>
      <RelayEnvironmentProvider environment={environment}>
        {!useIsUserLoggedIn(router.route.split("/")[1]) ? (
          <Component {...pageProps} />
        ) : (
            <QueryRenderer<AppWrapperQuery>
              environment={environment}
              query={query}
              variables={{}}
              render={({
                error,
                props,
                retry,
              }: {
                error: Error;
                props: AppWrapperQueryResponse;
                retry: () => void;
              }) => {
                if (error) {
                  showNotification("Please login to Continue", "error");
                  return null;
                } else if (props) {
                  return (
                    <Component
                      {...pageProps}
                      viewer={props.getPlayer}
                      refetch={retry}
                    />
                  );
                } else {
                  return <Loader loading={true} />;
                }
              }}
            />
          )}
      </RelayEnvironmentProvider>
    </AppWrapper>
  );
}

export default CustomApp;
