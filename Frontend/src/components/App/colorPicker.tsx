import React from "react";
import { BlockPicker } from "react-color";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card,
    CardContent,
    Typography,
    CardHeader,
    IconButton,
    Grid,
    CardActions,
    Button,
    Popover,
} from "@material-ui/core";
import PaletteIcon from "@material-ui/icons/Palette";
import CloseIcon from "@material-ui/icons/Close";
const useStyles = makeStyles({
    footer: {
        paddingTop: "16px",
    },
    action: {
        position: "absolute",
        right: "0px",
        marginTop: "20px",
    },
    button: {
        margin: "10px",
    },

    root: {
        width: "32%",
        marginTop: "70px",
        height: "max-content",
        paddingBottom: "35px",
        zIndex: 1,
        minWidth: "300px",
    },
    media: {
        // height: 140,
    },
    grid: {
        flexGrow: 1,
        display: "flex",
    },
});
interface ColorPickerProps {
    [key: string]: any;
    // valuePrim: string;
    // valueSec: string;
    // setPrimary: (a: string) => void;
    // setSecondary: (a: string) => void;
    // onClick?: () => void;
    // reset: () => void;
    // onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = () => {
    const classes = useStyles();
    const [primaryColor, setPrimaryColor] = React.useState("");
    const [secondyColor, setSecondaryColor] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "color-picker-menu" : undefined;

    return (
        <IconButton onClick={handleClick}>
            <PaletteIcon />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}>
                <Typography>The content of the Popover.</Typography>
            </Popover>
        </IconButton>
        // <Card className={classes.root}>
        //     <CardHeader
        //         action={
        //             <IconButton aria-label="cancel">
        //                 <CloseIcon />
        //             </IconButton>
        //         }
        //         title="Choose colors your app yourself"
        //         subheader="Define color of app yourself"
        //         titleTypographyProps={{ variant: "body1" }}
        //         subheaderTypographyProps={{ variant: "caption" }}
        //     />
        //     <CardContent>
        //         <div className={classes.grid}>
        //             <Grid container spacing={4}>
        //                 <Grid item lg={6}>
        //                     <div>
        //                         <BlockPicker
        //                             color={"#ff000"}
        //                             // onChange={(a) => setPrimaryColor(a)}
        //                         />
        //                     </div>
        //                     <div className={classes.footer}>
        //                         <Typography align={"center"}>
        //                             Primary Color
        //                         </Typography>
        //                     </div>
        //                 </Grid>
        //                 <Grid item lg={6}>
        //                     <div>
        //                         <BlockPicker
        //                             color={secondyColor}
        //                             // onChange={(a: any) => setSecondaryColor(a)}
        //                         />
        //                     </div>
        //                     <div className={classes.footer}>
        //                         <Typography align={"center"}>
        //                             Secondary Color
        //                         </Typography>
        //                     </div>
        //                 </Grid>
        //             </Grid>
        //         </div>
        //     </CardContent>
        //     <CardActions>
        //         <div className={classes.action}>
        //             <Button
        //                 variant="outlined"
        //                 color="primary"
        //                 className={classes.button}
        //                 // onClick={() => reset()}
        //             >
        //                 Reset
        //             </Button>
        //             <Button
        //                 variant="contained"
        //                 color="primary"
        //                 className={classes.button}
        //                 // onClick={() => {
        //                 //     setPrimary(primaryColor);
        //                 //     setSecondary(secondyColor);
        //                 // }}
        //             >
        //                 Apply
        //             </Button>
        //         </div>
        //     </CardActions>
        // </Card>
    );
};

export default ColorPicker;
