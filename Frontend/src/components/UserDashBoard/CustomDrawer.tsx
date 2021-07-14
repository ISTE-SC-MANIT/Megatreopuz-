import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import MailIcon from "@material-ui/icons/Mail";
import ViewListIcon from "@material-ui/icons/ViewList";
import ThemeToggleButton from "../theme/modeToggle";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GamepadIcon from "@material-ui/icons/Gamepad";
import InfoIcon from "@material-ui/icons/Info";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useRouter } from "next/dist/client/router";
import cookie from "js-cookie";
import {
  Avatar,
  Box,
  Fade,
  MenuItem,
  Menu,
  Tooltip,
  Button,
} from "@material-ui/core";
// import { Hidden} from "@material-ui/core";
// import { name } from "faker";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useCustomNotification } from "../App/useNotification";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerPaper: {
      width: drawerWidth,
    },
    paper: { justifyContent: "space-between", overflow: "hidden" },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.down("xs")]: {
        width: 0,
      },
    },
    mobileMenu: {
      position: "fixed",
      top: theme.spacing(1),
      left: theme.spacing(2),
      zIndex: theme.zIndex.drawer,
    },
    upperHalf: {},
    lowerHalf: {},
    title: {
      flexGrow: 1,
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  })
);

interface DrawerProps {
  name: string;
  username: string;
  page: string;
}

const CustomDrawer: React.FC<DrawerProps> = ({ name, username, page }) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openAnchor = Boolean(anchorEl);
  const classes = useStyles({ open });
  const router = useRouter();
  const showNotification = useCustomNotification();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const icons = [
    {
      label: "Dashboard",
      icon: (
        <Tooltip title={"Dashboard"}>
          <DashboardIcon />
        </Tooltip>
      ),
      onClick: () => {
        router.push("/dashboard");
      },
    },
    {
      label: "Contest",
      icon: (
        <Tooltip title={"Contest"}>
          <GamepadIcon />
        </Tooltip>
      ),
      onClick: () => {
        router.push("/dashboard/contest");
      },
    },
    {
      label: "Leader Board",
      icon: (
        <Tooltip title={"Leader Board"}>
          <ImportantDevicesIcon />
        </Tooltip>
      ),
      onClick: () => {
        router.push("/dashboard/leaderboard");
      },
    },
    {
      label: "Instructions",
      icon: (
        <Tooltip title={"Instructions"}>
          <ViewListIcon />
        </Tooltip>
      ),
      onClick: () => {
        router.push("/dashboard/instructions");
      },
    },
    {
      label: "Update Info",
      icon: (
        <Tooltip title={"Update Info"}>
          <InfoIcon />
        </Tooltip>
      ),
      onClick: () => {
        router.push("/dashboard/updateProfile");
      },
    },
    {
      label: "Log Out",
      icon: (
        <Tooltip title={"Log out"}>
          <ExitToAppIcon />
        </Tooltip>
      ),
      onClick: () => {
        cookie.remove("authorization");
        router.push("/");
        showNotification("Logout Succefully", "success");
      },
    },
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            {page}
          </Typography>
          <div>
            <Button
              href="https://www.facebook.com/megatreopuz/"
              target="_blank"
            >
              HINTS
            </Button>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {/* <AccountCircle /> */}
              <Avatar
                alt="account"
                src="/account.svg"
                className={classes.small}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openAnchor}
              onClose={handleClose}
            >
              <MenuItem onClick={() => router.push("/dashboard/updateProfile")}>
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  cookie.remove("authorization");
                  router.push("/");
                  showNotification("Logout Succefully", "success");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.paper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div>
          <Box
            paddingTop={2}
            paddingBottom={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Avatar>{name[0].toUpperCase()}</Avatar>
            <Fade in={open}>
              <Typography variant="subtitle2">{username}</Typography>
            </Fade>
          </Box>
          <Divider />
          <List>
            {icons.map((icon, index) => (
              <ListItem button key={index} onClick={icon.onClick}>
                <ListItemIcon>{icon.icon}</ListItemIcon>
                <ListItemText primary={icon.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </div>
        <div>
          <Fade in={open}>
            <Box
              paddingBottom={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <ThemeToggleButton />
            </Box>
          </Fade>
          <Divider />
          <Box
            height={50}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton onClick={() => setOpen((o) => !o)}>
              {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>
        </div>
      </Drawer>
    </div>
  );
};
export default CustomDrawer;
