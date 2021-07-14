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
                formId={id}
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
                    formId={"loerm"}
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
                    formId={"loerm"}
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
                    formId={"loerm"}
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
                    formId={"loerm"}
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
                    formId={"loerm"}
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

    describe("Email", () => {
        it("Renders correctly", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const email = screen.queryByLabelText("Email") as HTMLInputElement;
            expect(email).toBeTruthy();
            expect(email).toHaveAttribute("id", "email");
            expect(email).not.toHaveAttribute("aria-invalid", "true");

            const helperText = document.getElementById(
                email.getAttribute("aria-describedby")
            );
            expect(helperText).toBeFalsy();
        });
        it("Email is required Field", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const email = screen.queryByLabelText("Email") as HTMLInputElement;
            expect(email).toBeTruthy();
            expect(email).toHaveAttribute("id", "email");
            expect(email).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.blur(email)

            console.log(email.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                email.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("Email cant be empty");
        });

        it("Should Show error while entering Invalid email", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const email = screen.queryByLabelText("Email") as HTMLInputElement;
            expect(email).toBeTruthy();
            expect(email).toHaveAttribute("id", "email");
            expect(email).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.change(email, { target: { value: "asdas" } });

            console.log(email.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                email.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("Email cant be empty");
        });


    })

    describe("College", () => {
        it("Renders correctly", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const college = screen.queryByLabelText("College") as HTMLInputElement;
            expect(college).toBeTruthy();
            expect(college).toHaveAttribute("id", "college");
            expect(college).not.toHaveAttribute("aria-invalid", "true");

            const helperText = document.getElementById(
                college.getAttribute("aria-describedby")
            );
            expect(helperText).toBeFalsy();
        });
        it("College is required Field", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const college = screen.queryByLabelText("College") as HTMLInputElement;
            expect(college).toBeTruthy();
            expect(college).toHaveAttribute("id", "email");
            expect(college).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.blur(college)

            console.log(college.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                college.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("College cant be empty");
        });




    })

    describe("Country", () => {
        it("Renders correctly", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const country = screen.queryByLabelText("Country") as HTMLInputElement;
            expect(country).toBeTruthy();
            expect(country).toHaveAttribute("id", "country");
            expect(country).not.toHaveAttribute("aria-invalid", "true");

            const helperText = document.getElementById(
                country.getAttribute("aria-describedby")
            );
            expect(helperText).toBeFalsy();
        });
        it("Country is required Field", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const country = screen.queryByLabelText("Country") as HTMLInputElement;
            expect(country).toBeTruthy();
            expect(country).toHaveAttribute("id", "email");
            expect(country).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.blur(country)

            console.log(country.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                country.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("Country cant be empty");
        });




    })

    describe("Phone", () => {
        it("Renders correctly", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const phone = screen.queryByLabelText("Phone") as HTMLInputElement;
            expect(phone).toBeTruthy();
            expect(phone).toHaveAttribute("id", "phone");
            expect(phone).not.toHaveAttribute("aria-invalid", "true");

            const helperText = document.getElementById(
                phone.getAttribute("aria-describedby")
            );
            expect(helperText).toBeFalsy();
        });
        it("Phone is required Field", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const phone = screen.queryByLabelText("Phone") as HTMLInputElement;
            expect(phone).toBeTruthy();
            expect(phone).toHaveAttribute("id", "email");
            expect(phone).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.blur(phone)

            console.log(phone.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                phone.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("Phone cant be empty");
        });




    })


    describe("Year", () => {
        it("Renders correctly", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const year = screen.queryByLabelText("Year") as HTMLInputElement;
            expect(year).toBeTruthy();
            expect(year).toHaveAttribute("id", "year");
            expect(year).not.toHaveAttribute("aria-invalid", "true");

            const helperText = document.getElementById(
                year.getAttribute("aria-describedby")
            );
            expect(helperText).toBeFalsy();
        });
        it("Year is required Field", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const year = screen.queryByLabelText("Year") as HTMLInputElement;
            expect(year).toBeTruthy();
            expect(year).toHaveAttribute("id", "year");
            expect(year).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.blur(year)

            console.log(year.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                year.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("Year cant be empty");
        });

        it("Should Show error while entering Invalid Year", async () => {

            render(
                <SignUpForm
                    formId={"loerm"}
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

            const year = screen.queryByLabelText("Year") as HTMLInputElement;
            expect(year).toBeTruthy();
            expect(year).toHaveAttribute("id", "year");
            expect(year).not.toHaveAttribute("aria-invalid", "true");
            fireEvent.change(year, { target: { value: "asdas" } });

            console.log(year.getAttribute("aria-describedby"))
            const helperText = document.getElementById(
                year.getAttribute("aria-describedby")
            );
            expect(helperText).toBe("year must be a `number` type, but the final value was: `NaN` (cast from the value `asdas`).");
        });


    })
});
