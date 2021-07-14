import React, { useState } from "react";
import {
    TextFieldProps,
    TextField,
    InputAdornment,
    IconButton,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

interface Props {
    showToggle?: boolean;
}

const PasswordInput: React.FC<Props & TextFieldProps> = ({
    showToggle,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const buttonProps = React.useMemo(() => {
        const o = {};
        props.id && (o["aria-controls"] = props.id);
        return o;
    }, [props]);


    return (
        <TextField
            {...props}
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment: showToggle ? (
                    <InputAdornment position="end">
                        <IconButton
                            {...buttonProps}
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((p) => !p)}
                            edge="end">
                            {showPassword ? (
                                <Visibility
                                    color={props.error ? "error" : "action"}
                                />
                            ) : (
                                <VisibilityOff
                                    color={props.error ? "error" : "action"}
                                />
                            )}
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
        />
    );
};

export default PasswordInput;
