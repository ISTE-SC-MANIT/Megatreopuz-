"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const express_1 = __importDefault(require("express"));
const graphql_1 = require("./graphql");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function main() {
    // Make the application
    const app = express_1.default();
    // Cookie parser
    app.use(cookie_parser_1.default(process.env.COOKIE_SECRET));
    // Connect to graphql
    (await graphql_1.makeServer()).applyMiddleware({ app, path: "/graphql" });
    // Extract port from the environment
    const port = process.env.PORT;
    if (!port)
        throw new Error(`Missing port from the environment`);
    // Listen on the port
    app.listen(parseInt(port), (err) => {
        if (err)
            console.error(err);
        else
            console.log(`Listening on port: `, process.env.PORT);
    });
}
main();
//# sourceMappingURL=index.js.map