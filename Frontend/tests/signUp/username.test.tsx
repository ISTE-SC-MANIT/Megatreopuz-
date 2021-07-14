import React from "react";
import Username from "../../src/components/SignUp/username";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "@testing-library/jest-dom/extend-expect";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import { CircularProgress } from "@material-ui/core";

describe("Username component", () => {
    beforeEach(() => jest.clearAllMocks());
    it("Renders with correct default attributes", () => {
        render(<Username />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
    });
    it("Renders correct null state", () => {
        render(<Username />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
        expect(username).not.toHaveAttribute("aria-invalid", "true");

        const helperText = document.getElementById(
            username.getAttribute("aria-describedby")
        );
        expect(helperText).toBeTruthy();
        expect(CircularProgress).not.toHaveBeenCalled();
        expect(Clear).not.toHaveBeenCalled();
        expect(Check).not.toHaveBeenCalled();
    });
    it("Renders correct loading state", () => {
        render(<Username state="loading" />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
        expect(username).not.toHaveAttribute("aria-invalid", "true");

        const helperText = document.getElementById(
            username.getAttribute("aria-describedby")
        );
        expect(helperText).toBeTruthy();
        expect(screen.queryByRole("progressbar")).toBeTruthy();
        expect(CircularProgress).toHaveBeenCalled();
        expect((CircularProgress as jest.Mock).mock.calls[0][0]).toMatchObject({
            size: 16,
            color: "inherit",
        });
        expect(Clear).not.toHaveBeenCalled();
        expect(Check).not.toHaveBeenCalled();
    });
    it("Renders correct valid state", () => {
        render(<Username state="valid" />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
        expect(username).not.toHaveAttribute("aria-invalid", "true");

        const helperText = document.getElementById(
            username.getAttribute("aria-describedby")
        );
        expect(helperText).toHaveTextContent("Username is available");
        expect(CircularProgress).not.toHaveBeenCalled();
        expect(Clear).not.toHaveBeenCalled();
        expect(Check).toHaveBeenCalled();
    });
    it("Renders correct unavailable state", () => {
        render(<Username state="unavailable" />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
        expect(username).toHaveAttribute("aria-invalid", "true");

        const helperText = document.getElementById(
            username.getAttribute("aria-describedby")
        );
        expect(helperText).toHaveTextContent("Username is not available");
        expect(CircularProgress).not.toHaveBeenCalled();
        expect(Clear).toHaveBeenCalled();
        expect(Check).not.toHaveBeenCalled();
        expect((Clear as jest.Mock).mock.calls[0][0]).toMatchObject({
            color: "error",
        });
    });
    it("Lets user override helper text", () => {
        render(<Username state="unavailable" helperText="Sample" />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
        expect(username).toHaveAttribute("aria-invalid", "true");

        const helperText = document.getElementById(
            username.getAttribute("aria-describedby")
        );
        expect(helperText).toHaveTextContent("Sample");
    });
    it("Lets user override error state", () => {
        render(<Username state="valid" error helperText="Sample" />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
        });

        const username = screen.queryByLabelText("Username");
        expect(username).toBeTruthy();
        expect(username).toHaveAttribute("id", "username");
        expect(username).toHaveAttribute("aria-invalid", "true");

        const helperText = document.getElementById(
            username.getAttribute("aria-describedby")
        );
        expect(helperText).toHaveTextContent("Sample");
    });
});
