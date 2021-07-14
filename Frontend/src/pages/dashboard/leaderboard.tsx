import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Image from "next/image";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Grid,
  TextField,
  Tooltip,
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { NextPage } from "next";
import { ProtectedPageProps } from "../_app";
import CustomDrawer from "../../components/UserDashBoard/CustomDrawer";
import query from "../../components/Relay/queries/GetLeaderBoardQuery";
import { useQuery, useRelayEnvironment } from "relay-hooks";
import { GetLeaderBoardQuery } from "../../__generated__/GetLeaderBoardQuery.graphql";
import ErrorComponent from "../../components/App/ErrorComponent";
import LoadingScreen from "../../components/App/QueryLoaderScreen";

const useStyles = makeStyles((theme) => ({
  // root: {
  //     margin: 0,
  //     padding: 0,
  //     boxSizing: 'border-box',
  //     minHeight: '100vh',
  // },

  root: {
    minWidth: 650,

    marginTop: theme.spacing(16),
    "& .MuiTableContainer-root": {
      width: "80% !important",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  box: {
    width: "70%",
    borderRadius: theme.spacing(1 / 2),
    // border: `1px solid black`,
  },
  nullText: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
    lineHeight: "200px",
  },
  dialogActions: {
    display: "flex",
    flexWrap: "wrap",
  },
  nextBtn: {
    // marginRight: 'auto',
    [theme.breakpoints.down("lg")]: {
      margin: theme.spacing(1),
    },
  },
  reviewBtn: {
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(1),
    },
  },
  noSelect: {
    userSelect: "none",
  },
  imageBox: {
    borderStyle: "solid",
    borderWidth: theme.spacing(1 / 8),
    borderRadius: theme.spacing(1 / 4),
    borderColor: theme.palette.divider,
    padding: theme.spacing(2),
  },
  img: {
    borderRadius: theme.spacing(1),
  },

  media: {
    height: 200,
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
}));

const LeaderBoard: NextPage<ProtectedPageProps> = ({ viewer }) => {
  const classes = useStyles();

  const { data, error, retry, isLoading } = useQuery<GetLeaderBoardQuery>(
    query
  );

  return (
    <div>
      <CustomDrawer
        name={viewer.name}
        username={viewer.userName}
        page={"Leader Board"}
      />
      {Boolean(error) ? (
        <ErrorComponent error={error as any} />
      ) : isLoading ? (
        <Box className={classes.loading}>
          <LoadingScreen loading={isLoading} />{" "}
        </Box>
      ) : (
        <>
          <div className={classes.root}>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <caption>
                  Need to solve at least 1 question to make a place on leader
                  board
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <b>Rank</b>
                    </TableCell>
                    {/* <TableCell align="center">
                      <b>Name </b>
                    </TableCell> */}
                    <TableCell align="center">
                      <b>Username </b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Questions Solved</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.getLeaderBoard.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      {/* <TableCell align="center">{row.name}</TableCell> */}
                      <TableCell align="center">{row.username}</TableCell>
                      <TableCell align="center">
                        {row.questionAttempted}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderBoard;
