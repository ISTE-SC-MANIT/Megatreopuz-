import React, { useEffect } from "react";
import { NextPage } from "next";
import firebase from "firebase/app";
import { useRouter } from "next/dist/client/router";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Container,
    CircularProgress,
    Box,
} from "@material-ui/core";
import { useCustomNotification } from "../App/useNotification";

const useStyles = makeStyles({
    section: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    article: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
});

interface Props {
    code: string;
}

const VerifyEmail: NextPage<Props> = ({ code }) => {
    const classes = useStyles();
    const router = useRouter();
    const showNotification = useCustomNotification()
    useEffect(() => {
        firebase
            .auth()
            .applyActionCode(code)
            .then(() => {
                showNotification("Email verified", "success")
                router.push("/login");
            })
            .catch(() => { showNotification("Something went wrong", "error") });
    }, [code, router]);
    return (
        <section className={classes.section}>
            <Container maxWidth="md">
                <article className={classes.article}>
                    <Box m={2}>
                        <CircularProgress size="3rem" />
                    </Box>
                    <Typography variant="h5" align="center" component="h1">
                        Please wait while we verify your Email-ID
                    </Typography>
                </article>
            </Container>
        </section>
    );
};

export default VerifyEmail;
