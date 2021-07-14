import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { LoginClass } from "./login";
import admin from "firebase-admin";

import redis, { RedisClient } from "redis";
import { credentials } from "grpc";
import { AuthServiceClient } from "../protos/auth_grpc_pb";
import { UserServiceClient } from "../protos/user_grpc_pb";
import { UserClass } from "./user";

const serviceAccount = require("../../../m2.json");
export interface ContextType {
  res: Express.Response;
  req: Express.Request;
  // redisClient: RedisClient;
  authToken?: string;
  authClient: AuthServiceClient;
  userClient: UserServiceClient;
}

export async function makeServer(): Promise<ApolloServer> {
  const schema = await buildSchema({
    resolvers: [LoginClass, UserClass],
  });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // const opts: redis.ClientOpts = {
  //     host: process.env.REDIS_HOST,
  //     port: parseInt(process.env.REDIS_PORT || "6379"),
  // };
  // if (process.env.REDIS_PASSWORD) opts.password = process.env.REDIS_PASSWORD;
  // const redisClient = redis.createClient(opts);
  const authClient = new AuthServiceClient(
    process.env.AUTH_GRPC_SERVER ?? "",
    credentials.createInsecure()
  );

  const userClient = new UserServiceClient(
    process.env.USER_GRPC_SERVER ?? "",
    credentials.createInsecure()
  );

  return new ApolloServer({
    schema,
    context: ({ req, res }): ContextType => ({
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
