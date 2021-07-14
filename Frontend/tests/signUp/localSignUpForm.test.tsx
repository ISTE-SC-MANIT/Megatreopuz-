import faker from "faker";
import React from "react";
import SignUpLocalForm from "../../src/components/SignUp/localForm";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("Local user sign up", () => {
    it("Renders a form with correct props", () => {
        const id = faker.random.uuid();
        render(
            <SignUpLocalForm
                onSubmit={console.log}
                formProps={{
                    id,
                }}
            />,
            {
                wrapper: ({ children }) => (
                    <ThemeProvider theme={createMuiTheme()}>
                        {children}
                    </ThemeProvider>
                ),
            }
        );
        const form = screen.queryByRole("form");
        expect(form).toBeTruthy();
        expect(form).toHaveAttribute("id", id);
    });

    it("Renders an email field with proper validations", async () => {
        const id = faker.random.uuid();
        render(
            <SignUpLocalForm
                onSubmit={console.log}
                formProps={{
                    id,
                }}
            />,
            {
                wrapper: ({ children }) => (
                    <ThemeProvider theme={createMuiTheme()}>
                        {children}
                    </ThemeProvider>
                ),
            }
        );
        const email = screen.queryByLabelText("Email *");
        expect(email).toHaveAttribute("required", "");
        expect(email).toHaveAttribute("aria-invalid", "false");
        expect(email).toHaveAttribute("type", "email");

        fireEvent.blur(email);
        await waitFor(() =>
            expect(email).toHaveAttribute("aria-invalid", "true")
        );

        const helperText = document.getElementById(
            email.getAttribute("aria-describedby")
        );

        expect(helperText).toHaveTextContent("Email cannot be empty");
        fireEvent.change(email, { target: { value: "fhlkdfasl" } });
        await waitFor(() => {
            expect(helperText).toHaveTextContent("Provide a valid Email ID");
            expect(email).toHaveAttribute("aria-invalid", "true");
        });

        fireEvent.change(email, { target: { value: faker.internet.email() } });
        await waitFor(() => {
            expect(helperText).toHaveTextContent(" ");
            expect(email).toHaveAttribute("aria-invalid", "false");
        });
    });

    it("Renders an password field with proper validations", async () => {
        const id = faker.random.uuid();
        render(
            <SignUpLocalForm
                onSubmit={console.log}
                formProps={{
                    id,
                }}
            />,
            {
                wrapper: ({ children }) => (
                    <ThemeProvider theme={createMuiTheme()}>
                        {children}
                    </ThemeProvider>
                ),
            }
        );
        const password = screen.queryByLabelText("Password *");
        expect(password).toHaveAttribute("required", "");
        expect(password).toHaveAttribute("aria-invalid", "false");

        fireEvent.blur(password);
        await waitFor(() =>
            expect(password).toHaveAttribute("aria-invalid", "true")
        );

        const helperText = document.getElementById(
            password.getAttribute("aria-describedby")
        );

        expect(helperText).toHaveTextContent("Password cannot be empty");
        fireEvent.change(password, { target: { value: "fh" } });
        await waitFor(() => {
            expect(helperText).toHaveTextContent(
                "Password must be atleast 6 characters long"
            );
            expect(password).toHaveAttribute("aria-invalid", "true");
        });

        fireEvent.change(password, { target: { value: faker.lorem.text(6) } });
        await waitFor(() => {
            expect(helperText).toHaveTextContent(" ");
            expect(password).toHaveAttribute("aria-invalid", "false");
        });
    });
});
