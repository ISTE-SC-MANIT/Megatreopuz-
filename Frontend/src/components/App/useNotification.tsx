import { toast, Slide } from "react-toastify";
import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    zIndex: 100,
  },
}));

interface Props {
  closeToast: () => void;
  severity: AlertProps["severity"];
  message: string;
}

const NotificationComponent: React.FC<Props> = ({
  closeToast,
  severity,
  message,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar open={true} autoHideDuration={5000} onClose={closeToast}>
        <Alert onClose={closeToast} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export const useSuccessNotification = () => {
  return (message: string) =>
    toast.success(message + "123", {
      transition: Slide,
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
};

export const useErrorNotification = () => {
  return (message: string) =>
    toast.error(message, {
      transition: Slide,
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
};

export const useCustomNotification = () => {
  return (message: string, variant: AlertProps["severity"]) =>
    toast(message, {
      position: "bottom-left",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: variant,
    });
};
