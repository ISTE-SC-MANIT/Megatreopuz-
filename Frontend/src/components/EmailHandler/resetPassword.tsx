import React, { useEffect } from "react";
import { NextPage } from "next";
import firebase from "firebase/app";
import { useRouter } from "next/dist/client/router";
import FormPage from "../FormPage";
import ResetPasswordForm from "../RequestReset/resetForm";
import { useCustomNotification } from "../App/useNotification";
interface Props {
    code: string;
}

const ResetPassword: NextPage<Props> = ({ code }) => {
    const router = useRouter();
    const showNotification = useCustomNotification()
    const [email, setEmail] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    useEffect(() => {
        firebase
            .auth()
            .verifyPasswordResetCode(code)
            .then(setEmail)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [code]);
    const onSubmit = async ({ password }) => {
        setLoading(true);
        try {
            await firebase.auth().confirmPasswordReset(code, password);

            showNotification("Password reset succesful", "success")
            router.push("/login");
        } catch (e) {

            showNotification("Unable to reset password", "error")
        } finally {
            setLoading(false);
        }
    };
    return (
        <FormPage
            loading={loading}
            title={email}
            formID="reset-password-form"
            submitLabel="Reset Password">
            <ResetPasswordForm
                onSubmit={onSubmit}
                formProps={{ id: "reset-password-form" }}
            />
        </FormPage>
    );
};

export default ResetPassword;
