import React from "react";
import { NextPage } from "next";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ProtectedPageProps } from "../_app";
import CustomDrawer from "../../components/UserDashBoard/CustomDrawer";
import {
  Box,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      height: "100vh",
    },
    loading: {
      // margin: "0",
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    instructionBox: {
      padding: theme.spacing(2, 10),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
    },
  })
);

const UserDashboard: NextPage<ProtectedPageProps> = ({
  viewer,
  // refetch,
  // ...props
}) => {
  const classes = useStyles();

  const instructions = [
    "1. Megatreopuz '21 will be live from 13th February 2021 at 6:00 pm till 19th February 2021.",
    "2. A participant will receive successive questions. They will keep receiving questions until the cryptic hunt ends.",
    "3. The participant who solves the most number of questions in the least amount of time will be declared as the winner.",
    "4. The competition is open to everyone, there are no restrictions whatsoever.",
    "5. All participants are required to answer according to the following instructions:",
    "6. A participant needs to solve at least one question to make a place on the leaderboard.",
    "7. The hints for the questions will be provided on our Facebook page.",
    "8. You can attempt the question as many times as you want. The total number of attempts will not be counted towards ranking.",
    "9. In any case the decision of ISTE SC MANIT will be final.",
    "10. The winners need to be an account holder in an Indian bank to claim his/her cash prize.",
  ];
  const answerInstructions = [
    "1. Answers can be case insensitive.",
    "2. Whether you add space between the words or not both will be considered correct.",
    "3. Do not use special symbols and numbers while answering the questions (ex: !/*=#$).",
  ];
  return (
    <div className={classes.root}>
      <CustomDrawer
        name={viewer.name}
        username={viewer.userName}
        page={"Instructions"}
      />
      <Toolbar />
      <Box className={classes.instructionBox}>
        <Grid container justify="flex-start" alignItems="center">
          <List aria-label="instructions">
            {instructions.map((instruction) => (
              <ListItem key={instructions.indexOf(instruction)}>
                <ListItemText
                  primary={instruction}
                  secondary={
                    instructions.indexOf(instruction) === 4 ? (
                      <List>
                        {answerInstructions.map((instruction) => (
                          <ListItem key={instructions.indexOf(instruction)}>
                            <ListItemText primary={instruction}></ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    ) : null
                  }
                  primaryTypographyProps={{ color: "inherit" }}
                  secondaryTypographyProps={{ color: "inherit" }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box>
            <IconButton
              href="https://www.facebook.com/megatreopuz/"
              target="_blank"
            >
              <FacebookIcon fontSize="large" color="inherit" />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/istemanit/"
              target="_blank"
            >
              <InstagramIcon fontSize="large" color="inherit" />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/company/iste-sc-manit/"
              target="_blank"
            >
              <LinkedInIcon fontSize="large" color="inherit" />
            </IconButton>
          </Box>
          <Link
            color="inherit"
            href="https://istemanit.in/"
            target="_blank"
            style={{ cursor: "pointer" }}
          >
            ISTE SC MANIT
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default UserDashboard;
