import React from "react"
import { LinearProgress } from "@material-ui/core"
import { makeStyles, Theme, } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.modal + 1
    }
}));

interface Props {
    loading: boolean
}

const LinearLoader: React.FC<Props> = ({ loading }) => {

    const classes = useStyles()
    if (loading) {
        return <LinearProgress
            className={classes.root}
            color="secondary"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100
            }}
        />
    }
    return <></>

}


export default LinearLoader