import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import VerifyEmail from "../components/EmailHandler/verifyEmail";
import ResetPassword from "../components/EmailHandler/resetPassword";

const EmailAction: NextPage = () => {
    const router = useRouter();
    const code = router.query["oobCode"];
    const mode = router.query["mode"];

    const child = React.useMemo(() => {
        if (typeof code !== "string" || !code.length) return null;
        if (typeof mode !== "string" || !mode.length) return null;

        switch (mode) {
            case "verifyEmail":
                return <VerifyEmail code={code} />;
            case "resetPassword":
                return <ResetPassword code={code} />;

            default:
                return null;
        }
    }, [code, mode]);

    return <>{child}</>;
};
export default EmailAction;
