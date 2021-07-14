import "./env";
import express from "express";
import { makeServer } from "./graphql";
import cookieParser from "cookie-parser";

async function main() {
    // Make the application
    const app = express();

    // Cookie parser
    app.use(cookieParser(process.env.COOKIE_SECRET));

    // Connect to graphql
    (await makeServer()).applyMiddleware({ app, path: "/graphql" });

    // Extract port from the environment
    const port = process.env.PORT;
    if (!port) throw new Error(`Missing port from the environment`);
    // Listen on the port
    app.listen(parseInt(port), (err: Error) => {
        if (err) console.error(err);
        else console.log(`Listening on port: `, process.env.PORT);
    });
}

main();
