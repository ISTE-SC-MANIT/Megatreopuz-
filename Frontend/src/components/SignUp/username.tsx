import {
    TextField,
    TextFieldProps,
    InputAdornment,
    CircularProgress,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import React from "react";

export interface UsernameProps {
    state?: "loading" | "null" | "unavailable" | "valid";
}

const Username: React.FC<UsernameProps & TextFieldProps> = ({
    state = "null",
    ...props
}) => {
    const helperText = React.useMemo(() => {
        switch (state) {
            case "valid":
                return "Username is available";
            case "loading":
                return "Checking for availability";
            case "unavailable":
                return "Username is not available";
            default:
                return "Start typing to check for username availability";
        }
    }, [state]);

    const icon: React.ReactNode = React.useMemo(() => {
        switch (state) {
            case "valid":
                return <CheckIcon />;
            case "unavailable":
                return <Clear color="error" />;

            case "loading":
                return <CircularProgress size={16} color="inherit" />;
            default:
                return <></>;
        }
    }, [state]);
    return (
        <TextField
            id="username"
            label="Username"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">{icon}</InputAdornment>
                ),
            }}
            {...props}
            helperText={props.helperText || helperText}
            error={props.error || state === "unavailable"}
        />
    );
};

export default Username;
