import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
    header: {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(3),
      },
    },
    dashboardImg: {
      width: "60%",
      [theme.breakpoints.down("sm")]: {
        width: "40%",
        marginBottom: theme.spacing(2),
      },
    },
    alignCenter: {
      [theme.breakpoints.down("sm")]: {
        textAlign: "center",
      },
    },
  })
);
interface props {
  name: string;
}
const DashboardImg: React.FC<props> = ({ name }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box mt={5} mb={5} className={classes.header}>
        <Grid container justify="center" alignItems="center">
          <Grid
            container
            item
            lg={5}
            md={6}
            xs={12}
            alignItems="center"
            justify="center"
          >
            <img
              src="/mega-dashboard.svg"
              className={classes.dashboardImg}
            ></img>
          </Grid>
          <Grid item lg={5} md={6} xs={12}>
            <Typography variant="h4" className={classes.alignCenter}>
              <b>Hello, {name[0].toUpperCase() + name.substring(1)}</b>
            </Typography>
            <Typography className={classes.alignCenter}>
              Welcome to your Megatreopuz dashboard
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default DashboardImg;
