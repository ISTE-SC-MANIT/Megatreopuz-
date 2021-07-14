import React from "react";
import { Form, FormikFormProps, Formik, Field, FieldProps } from "formik";
import * as yup from "yup";
import { TextField, Link as MuiLink } from "@material-ui/core";
import PasswordInput from "../passwordInput";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";
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
  password: yup.string().required("Password cannot be empty"),
});

const LoginForm: React.FC<Props> = ({ formProps, onSubmit }) => {
  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      <Form id="login-form" aria-label="Login form" {...formProps}>
        <Field name="email">
          {({ field, meta }: FieldProps<typeof initialValues["email"]>) => (
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
          {({ field, meta }: FieldProps<typeof initialValues["password"]>) => (
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
        <Grid container>
          <Grid item xs>
            <Link href="/requestReset">
              <MuiLink
                href="/requestReset"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.stopPropagation();
                }}
              >
                Reset password
              </MuiLink>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup">
              <MuiLink
                href="/signup"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.stopPropagation();
                }}
              >
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Link>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

const defaultProps = {
  formProps: {},
};
LoginForm.defaultProps = defaultProps;
export default LoginForm;
