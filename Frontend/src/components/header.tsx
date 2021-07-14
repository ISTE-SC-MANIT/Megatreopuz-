import * as React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Box, Fade } from "@material-ui/core";
import NavbarHeader from "../components/navbarheader";
import ThemeToggleButton from "../components/theme/modeToggle";
import { useRouter } from "next/router";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      flexGrow: 1,
    },
    header: {
      minHeight: "10vh",
      alignItems: "center",
      flexWrap: "wrap",
      display: "flex",
      marginTop: "-20px",
    },
    logo: {
      marginRight: "auto",
      [theme.breakpoints.down("sm")]: {
        margin: "auto",
      },
    },
    menuBtn: {
      backgroundColor: "#3997F5",
      color: "white",
      marginRight: theme.spacing(1),
      "&:hover": {
        backgroundColor: "#1976D2",
      },
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    displayBtn: {
      display: "none",
    },
    darkTheme: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
);

const Header: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const path = router.pathname;

  return (
    <>
      <NavbarHeader open={open} setOpen={setOpen} />
      <div className={classes.root} onClick={() => setOpen(false)}>
        <Box padding={4} className={classes.header}>
          <Box className={classes.logo}>
            <img
              style={{ cursor: "pointer" }}
              src={
                theme.palette.type === "light"
                  ? "/megatreopuz.svg"
                  : "/wmegatreopuz.svg"
              }
              width="220px"
              alt="logo"
              onClick={() => router.push("/")}
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Fade in={true}>
              <Box className={classes.darkTheme}>
                <ThemeToggleButton />
              </Box>
            </Fade>
            <Button
              variant="contained"
              onClick={() => router.push("/login")}
              className={
                path === "/login" || path === "/signup/completeDetails"
                  ? classes.displayBtn
                  : classes.menuBtn
              }
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/signup")}
              className={
                path === "/signup" || path === "/signup/completeDetails"
                  ? classes.displayBtn
                  : classes.menuBtn
              }
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Header;
