import React from "react";
import SignUpForm from "../../src/components/SignUp/form";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import faker from "faker";
import Username from "../../src/components/SignUp/username";
import "@testing-library/jest-dom/extend-expect";
import { makeResolvable } from "../../src/components/resolvablePromise";
jest.mock("../../src/components/SignUp/username");
jest.useFakeTimers();
describe("Sign up form", () => {
    it("Renders a form with correct props", () => {
        const id = faker.random.uuid();
        render(
            <SignUpForm
                usernameCheck={(username: string) =>
                    makeResolvable((resolve) =>
                        resolve({
                            available: true,
                            username: username,
                        })
                    )
                }
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
    describe("Username", () => {
        it("Is a required field", async () => {
            render(
                <SignUpForm
                    usernameCheck={(username: string) =>
                        makeResolvable((resolve) =>
                            resolve({
                                available: true,
                                username: username,
                            })
                        )
                    }
                    onSubmit={console.log}
                />,
                {
                    wrapper: ({ children }) => (
                        <ThemeProvider theme={createMuiTheme()}>
                            {children}
                        </ThemeProvider>
                    ),
                }
            );

            const username = screen.queryByLabelText(
                "Username"
            ) as HTMLInputElement;
            expect((Username as jest.Mock).mock.calls[0][0]).toMatchObject({
                error: false,
            });
            fireEvent.blur(username);

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    error: true,
                    helperText: "Username cannot be empty",
                });
            });

            // Always in a null state
            for (const call of (Username as jest.Mock).mock.calls)
                expect(call[0]).toMatchObject({
                    state: "null",
                });
        });

        it("Goes from null to loading and then back", async () => {
            render(
                <SignUpForm
                    usernameCheck={(username: string) =>
                        makeResolvable((resolve) =>
                            setTimeout(
                                () =>
                                    resolve({
                                        available: true,
                                        username: username,
                                    }),
                                10000
                            )
                        )
                    }
                    onSubmit={console.log}
                />,
                {
                    wrapper: ({ children }) => (
                        <ThemeProvider theme={createMuiTheme()}>
                            {children}
                        </ThemeProvider>
                    ),
                }
            );

            const username = screen.queryByLabelText(
                "Username"
            ) as HTMLInputElement;
            expect((Username as jest.Mock).mock.calls[0][0]).toMatchObject({
                state: "null",
            });
            fireEvent.change(username, { target: { value: "Username" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "loading",
                });
            });

            fireEvent.change(username, { target: { value: "" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "null",
                });
            });

            for (const call of (Username as jest.Mock).mock.calls)
                expect(call[0]).not.toMatchObject({
                    state: "valid",
                });
        });

        it("Goes from null to loading to successful and then back", async () => {
            render(
                <SignUpForm
                    usernameCheck={(username: string) =>
                        makeResolvable((resolve) =>
                            setTimeout(
                                () =>
                                    resolve({
                                        available: true,
                                        username: username,
                                    }),
                                10000
                            )
                        )
                    }
                    onSubmit={console.log}
                />,
                {
                    wrapper: ({ children }) => (
                        <ThemeProvider theme={createMuiTheme()}>
                            {children}
                        </ThemeProvider>
                    ),
                }
            );

            const username = screen.queryByLabelText(
                "Username"
            ) as HTMLInputElement;
            expect((Username as jest.Mock).mock.calls[0][0]).toMatchObject({
                state: "null",
            });
            fireEvent.change(username, { target: { value: "Username" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "loading",
                });
            });

            jest.advanceTimersByTime(10000);

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "valid",
                });
            });

            fireEvent.change(username, { target: { value: "Usernam" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "loading",
                });
            });

            fireEvent.change(username, { target: { value: "" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "null",
                });
            });

            fireEvent.change(username, { target: { value: "Username" } });

            jest.advanceTimersByTime(10000);

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "valid",
                });
            });

            fireEvent.change(username, { target: { value: "" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "null",
                });
            });
        });

        it("Goes from null to loading to unavailable and then back", async () => {
            render(
                <SignUpForm
                    usernameCheck={(username: string) =>
                        makeResolvable((resolve) =>
                            setTimeout(
                                () =>
                                    resolve({
                                        available: false,
                                        username: username,
                                    }),
                                10000
                            )
                        )
                    }
                    onSubmit={console.log}
                />,
                {
                    wrapper: ({ children }) => (
                        <ThemeProvider theme={createMuiTheme()}>
                            {children}
                        </ThemeProvider>
                    ),
                }
            );

            const username = screen.queryByLabelText(
                "Username"
            ) as HTMLInputElement;
            expect((Username as jest.Mock).mock.calls[0][0]).toMatchObject({
                state: "null",
            });
            fireEvent.change(username, { target: { value: "Username" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "loading",
                });
            });

            jest.advanceTimersByTime(10000);

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "unavailable",
                });
            });

            fireEvent.change(username, { target: { value: "" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "null",
                });
            });

            fireEvent.change(username, { target: { value: "Username" } });

            jest.advanceTimersByTime(10000);

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "unavailable",
                });
            });

            fireEvent.change(username, { target: { value: "" } });
        });

        it("Avoids race condition", async () => {
            render(
                <SignUpForm
                    usernameCheck={(username: string) =>
                        makeResolvable((resolve) =>
                            setTimeout(
                                () =>
                                    resolve({
                                        available: username === "validUsername",
                                        username: username,
                                    }),
                                username === "validUsername" ? 10000 : 20000
                            )
                        )
                    }
                    onSubmit={console.log}
                />,
                {
                    wrapper: ({ children }) => (
                        <ThemeProvider theme={createMuiTheme()}>
                            {children}
                        </ThemeProvider>
                    ),
                }
            );

            const username = screen.queryByLabelText(
                "Username"
            ) as HTMLInputElement;
            expect((Username as jest.Mock).mock.calls[0][0]).toMatchObject({
                state: "null",
            });
            fireEvent.change(username, { target: { value: "Username" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "loading",
                });
            });

            fireEvent.change(username, { target: { value: "validUsername" } });

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "loading",
                });
            });

            jest.advanceTimersByTime(25000);

            await waitFor(() => {
                expect(
                    (Username as jest.Mock).mock.calls[
                        (Username as jest.Mock).mock.calls.length - 1
                    ][0]
                ).toMatchObject({
                    state: "valid",
                });
            });
        });
    });
});
