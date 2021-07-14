import React from "react";
import { NextPage } from "next";
import { Grid, CssBaseline, Box, Typography, Card } from "@material-ui/core";
// import Drawer from "../../components/UserDashBoard/Drawer";
import CustomCard from "../../components/App/card";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import AccessAlarmsIcon from "@material-ui/icons/AccessAlarms";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import BrushIcon from "@material-ui/icons/Brush";
import { ProtectedPageProps } from "../_app";
import { useQuery, useRelayEnvironment } from "relay-hooks";
import query from "../../components/Relay/queries/GetProfileInfoQuery";
import CustomDrawer from "../../components/UserDashBoard/CustomDrawer";
import DashboardImg from "../../components/UserDashBoard/dashboardImg";
import {
  GetProfileInfoQuery,
  GetProfileInfoQueryVariables,
} from "../../__generated__/GetProfileInfoQuery.graphql";
import LoadingScreen from "../../components/App/QueryLoaderScreen";
import ErrorComponent from "../../components/App/ErrorComponent";
import moment from "moment";
import Chart from "../../components/chart";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      height: "100vh",
    },
    chart: {
      width: "40%",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: theme.spacing(5),
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(8, 2),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4, 2, 0, 10),
      },
    },
    button: {
      margin: theme.spacing(2),
    },
    buttonContainer: {
      width: "40%",
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      marginTop: theme.spacing(2),
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
    b: { width: "250px", marginLeft: "auto", marginRight: "auto" },
    lineChart: {
      fontFamily: "Nunito",
      color: "inherit",
      padding: theme.spacing(1),
    },
  })
);
const getTime = (time) => {
  const days = Math.floor(time / 24);
  const hours = time % 24;
  return [days, hours];
};
const UserDashboard: NextPage<ProtectedPageProps> = ({
  viewer,
  // refetch,
  // ...props
}) => {
  const classes = useStyles();
  const vars: GetProfileInfoQueryVariables = {
    profileInput: { userId: viewer.id },
  };
  const { data, error, retry, isLoading } = useQuery<GetProfileInfoQuery>(
    query,
    vars
  );

  if (error) {
    return <ErrorComponent />;
  }

  const current = moment();
  const start = moment([2021, 1, 13, 18]);
  const end = moment([2021, 1, 19, 18]);
  const timeLeftStart = start.diff(current, "hours");
  const timeLeftEnd = end.diff(current, "hours");
  const minutesStart = start.diff(current, "minutes");
  const minutesEnd = end.diff(current, "minutes");
  const [daysStart, hoursStart] = getTime(timeLeftStart);
  const [daysEnd, hoursEnd] = getTime(timeLeftEnd);

  return (
    <div className={classes.root}>
      {/* <Drawer name={viewer.name} username={viewer.userName} /> */}
      <CssBaseline />
      <CustomDrawer
        name={viewer.name}
        username={viewer.userName}
        page={"Dashboard"}
      />
      {isLoading ? (
        <Box className={classes.loading}>
          <LoadingScreen loading={isLoading} />{" "}
        </Box>
      ) : (
        <main className={classes.main}>
          <DashboardImg name={viewer.name} />
          <Box mb={4}>
            {minutesStart >= 0 ? (
              <Typography variant="h5" align="center">
                Contest will start in{" "}
                {minutesStart > 60
                  ? `${hoursStart} hours !`
                  : `${minutesStart} minutes !`}
              </Typography>
            ) : minutesEnd >= 0 ? (
              <Typography variant="h5" align="center">
                Contest is<span style={{ color: "#46f20c" }}> Live !</span>
              </Typography>
            ) : (
              <Typography variant="h5" align="center">
                Contest has Ended!
              </Typography>
            )}
          </Box>
          <Grid container justify="center" spacing={3}>
            <Grid item lg={5} md={6} xs={12}>
              <CustomCard
                Icon={FaceIcon}
                color={"#fb8c00"}
                heading={"Rank"}
                data={
                  data.getMyProfileInfo.rank === -1
                    ? "N/A"
                    : `${data.getMyProfileInfo.rank + 1}`
                }
                unit={"position"}
                caption={
                  "Shows your rank among total number of participants in the Contest"
                }
              />
            </Grid>
            {alert}
            <Grid item lg={5} md={6} xs={12}>
              <CustomCard
                Icon={BrushIcon}
                color={"#2196F3"}
                heading={"Total attempts"}
                data={viewer.totalAttempts.toString()}
                unit={"attempts"}
                caption={
                  "Shows total number of attempts made by you in the Contest"
                }
              />
            </Grid>
            <Grid item lg={5} md={6} xs={12}>
              <CustomCard
                Icon={SpellcheckIcon}
                color={"#55B05D"}
                heading={"Correct Questions"}
                data={`${viewer.solvedQuestions}`}
                unit={"questions"}
                caption={"Shows how much questions you have done correctly"}
              />
            </Grid>
            <Grid item lg={5} md={6} xs={12}>
              <CustomCard
                Icon={AccessAlarmsIcon}
                color={"#E7403B"}
                heading={"Time Left"}
                data={
                  minutesEnd >= 0
                    ? daysEnd > 0
                      ? `${daysEnd}d ${hoursEnd}h`
                      : hoursEnd > 0
                      ? `${hoursEnd} hours`
                      : `${minutesEnd} minutes`
                    : "Contest has Ended !"
                }
                unit={""}
                caption={"Shows time remaining for Contest to be concluded"}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={3} className={classes.lineChart}>
                <Chart
                  rank={
                    data.getMyProfileInfo.rank === -1
                      ? 0
                      : data.getMyProfileInfo.rank + 1
                  }
                  answers={viewer.solvedQuestions}
                  attempts={viewer.totalAttempts}
                />
              </Card>
            </Grid>
          </Grid>
        </main>
      )}{" "}
    </div>
  );
};

export default UserDashboard;
