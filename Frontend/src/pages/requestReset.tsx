import React from "react";
import { NextPage } from "next";
import FormPage from "../components/FormPage";
import RequestResetForm from "../components/RequestReset/form";
import firebase from "firebase/app";
import { useCustomNotification } from "../components/App/useNotification";

const RequestReset: NextPage = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const showNotification = useCustomNotification()

    // TODO: Check the state of the user : logged in or out?
    const onSubmit = async ({ email }: { email: string; password: string }) => {
        setLoading(true);
        try {
            await firebase.auth().sendPasswordResetEmail(email);

            showNotification("Password reset mail sent", "success")
        } catch (e) {
            showNotification("Something went wrong, Please try again later !", "error")
        } finally {
            setLoading(false);
        }
    };
    return (
        <FormPage
            loading={loading}
            title="Request password reset"
            formID="request-reset-form"
            submitLabel="Request Reset"
            backButton={true}>
            <RequestResetForm onSubmit={onSubmit} />
        </FormPage>
    );
};

export default RequestReset;
