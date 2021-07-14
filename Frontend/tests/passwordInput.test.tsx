import React from "react";
import PasswordInput from "../src/components/passwordInput";
import { render, screen, fireEvent } from "@testing-library/react";
import ReactDOMServer from "react-dom/server";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import faker from "faker";
import "@testing-library/jest-dom/extend-expect";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

describe("Password Input", () => {
    afterEach(() => jest.clearAllMocks());

    const theme = createMuiTheme();
    it("Hydrates without error", () => {
        const spy = jest.spyOn(console, "error");
        const output = ReactDOMServer.renderToString(
            <ThemeProvider theme={theme}>
                <PasswordInput />
            </ThemeProvider>
        );

        const container = document.createElement("div");
        container.innerHTML = output;
        render(<PasswordInput />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={createMuiTheme()}>
                    {children}
                </ThemeProvider>
            ),
            hydrate: true,
            container,
        });

        for (const call of spy.mock.calls)
            expect(call[0]).not.toMatch(
                /Expected server HTML to contain a matching/
            );
    });

    it("Does not render the toggle button when told not to", () => {
        render(<PasswordInput />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            ),
        });

        expect(
            screen.queryByRole("button", { name: "toggle password visibility" })
        ).toBeFalsy();
    });

    it("Renders the toggle button when told to", () => {
        render(<PasswordInput showToggle />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            ),
        });

        expect(
            screen.queryByRole("button", { name: "toggle password visibility" })
        ).toBeTruthy();
    });

    it("Toggles between password and text type as needed", async () => {
        const id = faker.random.uuid();
        render(<PasswordInput id={id} label="LoremIpsum" showToggle />, {
            wrapper: ({ children }) => (
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            ),
        });

        const toggleButton = screen.queryByRole("button", {
            name: "toggle password visibility",
        });
        expect(toggleButton).toHaveAttribute("aria-controls", id);

        // Password
        const input = screen.queryByLabelText("LoremIpsum");
        expect(input.getAttribute("type")).toEqual("password");
        expect(VisibilityOff).toHaveBeenCalledTimes(1);
        expect(Visibility).not.toHaveBeenCalled();
        fireEvent.click(toggleButton);

        // Text
        expect(input.getAttribute("type")).toEqual("text");
        expect(VisibilityOff).toHaveBeenCalledTimes(1);
        expect(Visibility).toHaveBeenCalledTimes(1);
        // Password again
        fireEvent.click(toggleButton);

        expect(input.getAttribute("type")).toEqual("password");
        expect(VisibilityOff).toHaveBeenCalledTimes(2);
        expect(Visibility).toHaveBeenCalledTimes(1);

        for (const call of (Visibility as jest.Mock).mock.calls)
            expect(call[0]).toMatchObject({
                color: "action",
            });
        for (const call of (VisibilityOff as jest.Mock).mock.calls)
            expect(call[0]).toMatchObject({
                color: "action",
            });
    });

    it("Colours the toggle button as per theme", async () => {
        render(
            <PasswordInput
                id={faker.random.uuid()}
                label="LoremIpsum"
                showToggle
                error
            />,
            {
                wrapper: ({ children }) => (
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                ),
            }
        );

        fireEvent.click(
            screen.queryByRole("button", {
                name: "toggle password visibility",
            })
        );
        expect((VisibilityOff as jest.Mock).mock.calls[0][0]).toMatchObject({
            color: "error",
        });
        expect((Visibility as jest.Mock).mock.calls[0][0]).toMatchObject({
            color: "error",
        });
    });
});
