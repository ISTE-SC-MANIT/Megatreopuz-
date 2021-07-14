import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: fade(theme.palette.common.black, 0.5),
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}));

interface Props {
    loading: boolean;
}

const Loader: React.FunctionComponent<Props> = ({ loading }) => {
    const classes = useStyles();
    return loading ? (
        <section className={classes.root}>
            <CircularProgress
                style={{
                    color: "#fff"
                }}
            />
        </section>
    ) : null;
};

export default Loader;