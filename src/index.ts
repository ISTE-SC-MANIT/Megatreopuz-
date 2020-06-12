import express from "express";
import { config } from "dotenv";
import loginRouter from "./loginEndpoint";
// Load environment file
config();
// Make the application
const app = express();
// Plug in the login endpoint
app.use(loginRouter);

// Extract port from the environment
const port = process.env.PORT;
if (!port) throw new Error(`Missing port from the environment`);
// Listen on the port
app.listen(parseInt(port), (err: Error) => {
    if (err) console.error(err);
    else console.log(`Listening on port: `, process.env.PORT);
});
