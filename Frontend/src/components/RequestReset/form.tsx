import React from "react";
import { Form, FormikFormProps, Formik, Field, FieldProps } from "formik";
import * as yup from "yup";
import { TextField } from "@material-ui/core";
const initialValues = {
    email: "",
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
});

const RequestResetForm: React.FC<Props> = ({ formProps, onSubmit }) => {
    return (
        <Formik
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            initialValues={initialValues}>
            <Form
                id="request-reset-form"
                aria-label="Request reset form"
                {...formProps}>
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
            </Form>
        </Formik>
    );
};

const defaultProps = {
    formProps: {},
};
RequestResetForm.defaultProps = defaultProps;
export default RequestResetForm;
