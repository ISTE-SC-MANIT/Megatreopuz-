import {
  ThemeOptions,
  SimplePaletteColorOptions,
  createMuiTheme,
  Theme,
} from "@material-ui/core/styles";
import { blue, orange } from "@material-ui/core/colors";
import React from "react";
export const themeProps: ThemeOptions["props"] = {
  MuiTextField: {
    variant: "outlined",
    margin: "dense",
  },
};

export const defaultPrimary = blue[500];
export const defaultSecondary = orange[500];
export const defaultMode = "dark";
export interface ThemeContext {
  mode: ThemeOptions["palette"]["type"];
  primary: SimplePaletteColorOptions["main"];
  secondary: SimplePaletteColorOptions["main"];
  toggleMode: () => void;
  updateColors: (
    primary?: SimplePaletteColorOptions["main"],
    secondary?: SimplePaletteColorOptions["main"]
  ) => void;
}

export const themeContext = React.createContext<ThemeContext>({
  mode: "light",
  primary: blue[500],
  secondary: blue[500],
  toggleMode: () => {
    /* Do nothing */
  },
  updateColors: () => {
    /* Do nothing */
  },
});

export function toggleMode(
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
): void {
  setTheme((oldTheme) => {
    return createMuiTheme({
      typography: {
        fontFamily: [
          "Nunito",
          "Montserrat",
          "Roboto",
          "sans-serif",
          "Arial",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
      },
      props: themeProps,
      palette: {
        primary: {
          main: oldTheme.palette.primary.main,
        },
        secondary: {
          main: oldTheme.palette.primary.main,
        },
        type: oldTheme.palette.type === "dark" ? "light" : "dark",
      },
    });
  });
  return;
}
