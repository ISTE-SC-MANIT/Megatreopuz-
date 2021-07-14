"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeServer = void 0;
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const login_1 = require("./login");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const grpc_1 = require("grpc");
const auth_grpc_pb_1 = require("../protos/auth_grpc_pb");
const user_grpc_pb_1 = require("../protos/user_grpc_pb");
const user_1 = require("./user");
async function makeServer() {
    var _a, _b;
    const schema = await type_graphql_1.buildSchema({
        resolvers: [login_1.LoginClass, user_1.UserClass],
    });
    firebase_admin_1.default.initializeApp();
    // const opts: redis.ClientOpts = {
    //     host: process.env.REDIS_HOST,
    //     port: parseInt(process.env.REDIS_PORT || "6379"),
    // };
    // if (process.env.REDIS_PASSWORD) opts.password = process.env.REDIS_PASSWORD;
    // const redisClient = redis.createClient(opts);
    const authClient = new auth_grpc_pb_1.AuthServiceClient((_a = process.env.AUTH_GRPC_SERVER) !== null && _a !== void 0 ? _a : "", grpc_1.credentials.createInsecure());
    const userClient = new user_grpc_pb_1.UserServiceClient((_b = process.env.USER_GRPC_SERVER) !== null && _b !== void 0 ? _b : "", grpc_1.credentials.createInsecure());
    return new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({
            req,
            res,
            // redisClient: redisClient,
            authToken: req.cookies["authorization"],
            authClient,
            userClient,
        }),
        playground: {
            settings: {
                "request.credentials": "same-origin",
            },
        },
    });
}
exports.makeServer = makeServer;
//# sourceMappingURL=index.js.map