import React from "react";
import { Form, FormikFormProps, Formik, Field, FieldProps } from "formik";
import * as yup from "yup";
import Username, { UsernameProps } from "./username";
import { ResolvablePromise } from "../resolvablePromise";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { countries, countryToFlag } from "./countries";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
const initialValues = {
    username: "",
    phone: "",
    college: "",
    year: 1,
    country: countries[0],
    name: "",
};

interface Props {
    formProps?: FormikFormProps;
    onSubmit: (values: typeof initialValues) => void | Promise<void>;
    usernameCheck: (
        username: string
    ) => ResolvablePromise<{ available: boolean; username: string }>;
}

const validationSchema = yup.object({
    username: yup.string().required("Username cannot be empty"),
    name: yup.string().required("Name cannot be empty"),
    phone: yup.string().required("Phone number cannot be empty"),
    college: yup.string().required("College cannot be empty"),
    year: yup
        .number()
        .required("Year cannot be empty")
        .min(1, "Year cannot be less than 1"),
    country: yup.mixed().required("Country cannot be empty"),
});

const useStyles = makeStyles({
    option: {
        fontSize: 15,
        "& > span": {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

const SignUpForm: React.FC<Props> = ({
    formProps,
    onSubmit,
    usernameCheck,
}) => {
    const [usernameState, setUsernameState] = React.useState<
        UsernameProps["state"]
    >("null");
    const currentPromise = React.useRef<null | ResolvablePromise<{
        available: boolean;
        username: string;
    }>>(null);

    const currentUsername = React.useRef<string>("");

    const validateUsername: (
        value: string
    ) => Promise<string | undefined> = React.useMemo(() => {
        return async (username: string) => {
            // Explicitly return undefined to make things more clear

            if (currentUsername.current === username) {
                // Do nothing. Simply do nothing
                // Handles the case when blur event occurs
                return undefined;
            }

            // We will never return an error message.
            // Error messages are a part of the username component.
            // We simply nudge the username component with state here
            // This is because username component has 4 states. So it makes more
            // Sense to keep the stateful logic there and control it from here

            // Current username is different than the previous one
            currentUsername.current = username;
            currentPromise.current?.resolve({
                available: true,
                // A promise is never made for null values
                // So if a promise is resolved for empty username
                // We will know that it was resolved externally
                username: "",
            });

            if (!username) {
                setUsernameState("null");
                return undefined;
            }

            setUsernameState("loading");
            currentPromise.current = usernameCheck(username);
            try {
                // Wait for the query to be resolved
                const {
                    available,
                    username: oldUsername,
                } = await currentPromise.current.promise;
                // Promise might be resolved naturally or forcefully
                // Check the value to see

                if (!oldUsername) return undefined;
                setUsernameState(available ? "valid" : "unavailable");
                return undefined;
            } catch (e) {
                return "Could not validate username";
            }
        };
    }, [usernameCheck]);

    const classes = useStyles();
    return (
        <Formik
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            initialValues={initialValues}>
            <Form aria-label="Sign up form" {...formProps}>
                <Field name="username" validate={validateUsername}>
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["username"]>) => (
                            <Username
                                fullWidth
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error}
                                state={usernameState}
                                {...field}
                            />
                        )}
                </Field>
                <Field name="name">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["name"]>) => (
                            <TextField
                                fullWidth
                                id="name-input"
                                label="Name"
                                required
                                {...field}
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched ? meta.error : ""}
                            />
                        )}
                </Field>
                <Field name="country">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["country"]>) => (
                            <Autocomplete
                                {...field}
                                id="country-select"
                                options={countries}
                                classes={{
                                    option: classes.option,
                                }}
                                fullWidth
                                autoHighlight
                                getOptionLabel={(option) => option.label}
                                renderOption={(option) => (
                                    <React.Fragment>
                                        <span>{countryToFlag(option.code)}</span>
                                        {option.label} ({option.code})
                                    </React.Fragment>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        id="country-select-textfield"
                                        {...params}
                                        error={!!(meta.touched && meta.error)}
                                        helperText={meta.touched && meta.error}
                                        label="Choose a country"
                                        variant="outlined"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password", // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                            />
                        )}
                </Field>
                <Field name="phone">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["phone"]>) => (
                            <TextField
                                fullWidth
                                id="phone-input"
                                label="Phone number"
                                required
                                {...field}
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched ? meta.error : ""}
                            />
                        )}
                </Field>
                <Field name="college">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["college"]>) => (
                            <TextField
                                fullWidth
                                id="college-input"
                                label="College"
                                required
                                {...field}
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched ? meta.error : ""}
                            />
                        )}
                </Field>
                <Field name="year">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["year"]>) => (
                            <TextField
                                fullWidth
                                id="year-input"
                                label="Year"
                                required
                                inputProps={{ min: 0 }}
                                type="number"
                                {...field}
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched ? meta.error : ""}
                            />
                        )}
                </Field>
            </Form>

        </Formik>
    );
};

const defaultProps = {
    formProps: {},
};
SignUpForm.defaultProps = defaultProps;
export default SignUpForm;
