import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Divider, SvgIconTypeMap } from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

interface Props {
  Icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, "svg">>;
  heading: string;
  data: string;
  unit: string;
  caption: string;
  color: string;
}

type ThemeProps = Pick<Props, "color">;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
    height: 170,
  },
  iconBg: {
    height: "100px",
    width: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -10,
    left: -10,
    [theme.breakpoints.down("sm")]: {
      height: 80,
      width: 80,
      top: 0,
      left: 0,
    },
    zIndex: theme.zIndex.mobileStepper,
    backgroundColor: (props: ThemeProps) => props.color,
    color: (props: ThemeProps) => theme.palette.getContrastText(props.color),
  },
  icon: {
    color: (props: ThemeProps) => theme.palette.getContrastText(props.color),
    fontSize: "80px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 65,
    },
  },
  main: {
    float: "right",
    textAlign: "right",
  },
  min: {
    padding: "10px",
  },
  footer: {
    paddingTop: "10px",
  },
}));
const ImgMediaCard: React.FC<Props> = ({
  Icon,
  heading,
  data,
  unit,
  caption,
  color,
}) => {
  const classes = useStyles({ color });
  const i = <FaceIcon className={classes.icon} />;
  return (
    <div className={classes.root}>
      <Paper className={classes.iconBg} elevation={3} square={true}>
        <Icon className={classes.icon} />
      </Paper>
      <Card className={classes.root} elevation={2}>
        <CardContent className={classes.main}>
          <div className={classes.min}>
            <Typography
              gutterBottom
              variant={"h6"}
              component="h2"
              //   color="textSecondary"
            >
              {heading}
            </Typography>
            <Typography gutterBottom variant="h5" component={"data"}>
              {data}{" "}
              <Typography
                gutterBottom
                variant={"body1"}
                component={"span"}
                color="textSecondary"
              >
                {unit}
              </Typography>
            </Typography>
          </div>
          <Divider />
          <div className={classes.footer}>
            <Typography
              gutterBottom
              variant={"body1"}
              component={"span"}
              color="textSecondary"
            >
              {caption}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ImgMediaCard;
