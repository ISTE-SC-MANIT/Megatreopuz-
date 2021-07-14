import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { AuthServiceClient } from "../protos/auth_grpc_pb";
import { UserServiceClient } from "../protos/user_grpc_pb";
export interface ContextType {
    res: Express.Response;
    req: Express.Request;
    authToken?: string;
    authClient: AuthServiceClient;
    userClient: UserServiceClient;
}
export declare function makeServer(): Promise<ApolloServer>;
