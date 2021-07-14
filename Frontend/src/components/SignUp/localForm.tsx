import React from "react";
import { Form, FormikFormProps, Formik, Field, FieldProps } from "formik";
import * as yup from "yup";
import { TextField , Link as MuiLink } from "@material-ui/core";
import PasswordInput from "../passwordInput";
import Link from "next/link";

const initialValues = {
    email: "",
    password: "",
};

interface Props {
    formProps?: FormikFormProps;
    onSubmit: (values: typeof initialValues) => void | Promise<void>;
}

const validationSchema = yup.object({
    email: yup
        .string()
        .email("Provide a valid Email ID")
        .required("Email cannot be empty"),
    password: yup
        .string()
        .required("Password cannot be empty")
        .min(6, "Password must be atleast 6 characters long"),
});

const SignUpLocalForm: React.FC<Props> = ({ formProps, onSubmit }) => {
    return (
        <Formik
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            initialValues={initialValues}>
            <Form id="local-sign-up" aria-label="Sign up form" {...formProps}>
                <Field name="email">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["email"]>) => (
                        <TextField
                            fullWidth
                            id="email-input"
                            label="Email"
                            required
                            type="email"
                            {...field}
                            error={!!(meta.touched && meta.error)}
                            helperText={meta.touched ? meta.error : ""}
                        />
                    )}
                </Field>
                <Field name="password">
                    {({
                        field,
                        meta,
                    }: FieldProps<typeof initialValues["password"]>) => (
                        <PasswordInput
                            fullWidth
                            id="password-input"
                            label="Password"
                            required
                            showToggle
                            {...field}
                            error={!!(meta.touched && meta.error)}
                            helperText={meta.touched ? meta.error : ""}
                        />
                    )}
                </Field>
                <Link href="/login">
                        <MuiLink
                            href="/login"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                e.stopPropagation();
                            }}>
                            {"Already have an account? Login"}
                        </MuiLink>
                </Link>
            </Form>
        </Formik>
    );
};

const defaultProps = {
    formProps: {},
};
SignUpLocalForm.defaultProps = defaultProps;
export default SignUpLocalForm;
