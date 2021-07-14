import React from "react";
import HeadTags from "./head";
import { CssBaseline, Button, LinearProgress } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import "../firebase";
import firebase from "firebase/app";
import { createMuiTheme } from "@material-ui/core/styles";
import { RelayEnvironmentProvider, graphql } from "relay-hooks";
// import { getEnvironment } from "../Relay/environment";
import { Environment } from "react-relay";
import { useIsUserLoggedIn } from "./../../utils";
import {
  themeProps,
  defaultPrimary,
  defaultSecondary,
  defaultMode,
  toggleMode,
  themeContext,
} from "../theme";
import ThemeToggleButton from "../theme/modeToggle";
import ColorPicker from "./colorPicker";
import { ToastContainer } from "react-toastify";
import { useRouter, Router } from "next/dist/client/router";
import LinearLoader from "./LinearLoader";

const AppWrapper: React.FC = ({ children }) => {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // React.useEffect(() => {
  //     firebase.auth().onAuthStateChanged(async (user) => {
  //         if (user) {
  //             if (!user.emailVerified) {
  //                 try {
  //                     await user.sendEmailVerification();
  //                     console.log("Email sent");
  //                 } catch {
  //                     console.log("Error sending the verification email");
  //                 }
  //             }
  //         }
  //     });
  // });

  const [currentTheme, setCurrentTheme] = React.useState(() =>
    createMuiTheme({
      typography: {
        fontFamily: [
          "Nunito",
          "Montserrat",
          "Roboto",
          "sans-serif",
          "Arial",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
      },
      props: themeProps,
      palette: {
        primary: {
          main: defaultPrimary,
        },
        secondary: {
          main: defaultSecondary,
        },
        type: defaultMode,
      },
    })
  );

  const router = useRouter();
  const [routeChange, setRouteChange] = React.useState<boolean>(false);
  Router.events.on("routeChangeStart", () => {
    setRouteChange(true);
  });
  Router.events.on("routeChangeComplete", () => setRouteChange(false));
  Router.events.on("routeChangeError", () => setRouteChange(false));

  return (
    <>
      <HeadTags mainColor={currentTheme.palette.primary.main} />

      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {/* <CustomDrawer
                        toggleTheme={() => setDarkTheme(!darkTheme)}
                        primaryColor={primary}
                        theme2={theme2}
                        changePrimaryColor={(a) => { handleColorPrimaryChange(a) }}
                        secondaryColor={secondary}
                        changeSecondaryColor={(a) => { handleColorSecondaryChange(a) }}
                        reset={() => Reset()}
                    > */}
        <LinearLoader loading={routeChange} />
        <themeContext.Provider
          value={{
            mode: currentTheme.palette.type,
            primary: currentTheme.palette.primary.main,
            secondary: currentTheme.palette.secondary.main,
            toggleMode: () => toggleMode(setCurrentTheme),
            updateColors: () => {
              /* Do nothing */
            },
          }}
        >
          <main>{children}</main>
          <ToastContainer style={{ zIndex: 100, position: "absolute" }} />
        </themeContext.Provider>
        {/* </CustomDrawer> */}
      </ThemeProvider>
    </>
  );
};

export default AppWrapper;
