import TextField from "@material-ui/core/TextField";
import React from "react";
export default jest.fn((p) => (
    <TextField label="Username" id="username" {...p} />
));
