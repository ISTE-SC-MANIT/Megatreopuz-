
import React from "react"
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from "@material-ui/core";



interface Props {
    error?: string
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            marginTop: theme.spacing(10)

        },
        containerBox: {
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
            display: "flex"



        }
    })
)
const ErrorComponent: React.FC<Props> = ({ error }) => {
    const classes = useStyles()

    return <>
        <Box className={classes.root}>
            <Box className={classes.containerBox}>
                <Box >
                    <img src="/error.png"></img>
                    <Box >
                        <Box>
                            <Typography variant="h3" align="center">
                                Oops! Something went wrong.
            </Typography>
                        </Box>
                        <Box mt={1}>
                            <Typography variant="h6" align="center">
                                We are on it. Sit back relax until we fix it.
                                {Boolean(error) ? error : ""}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>

    </>
}

export default ErrorComponent