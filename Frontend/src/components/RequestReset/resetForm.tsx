import React from "react";
import { Form, FormikFormProps, Formik, Field, FieldProps } from "formik";
import * as yup from "yup";
import PasswordInput from "../passwordInput";
const initialValues = {
    password: "",
};

interface Props {
    formProps?: FormikFormProps;
    onSubmit: (values: typeof initialValues) => void | Promise<void>;
}

const validationSchema = yup.object({
    password: yup.string().required("Password cannot be empty").min(6),
});

const ResetPasswordForm: React.FC<Props> = ({ formProps, onSubmit }) => {
    return (
        <Formik
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            initialValues={initialValues}>
            <Form
                id="reset-password-form"
                aria-label="Reset password form"
                {...formProps}>
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
            </Form>
        </Formik>
    );
};

const defaultProps = {
    formProps: {},
};
ResetPasswordForm.defaultProps = defaultProps;
export default ResetPasswordForm;
