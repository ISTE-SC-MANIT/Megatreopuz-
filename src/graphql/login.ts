import {
  Resolver,
  Mutation,
  ObjectType,
  Field,
  Query,
  Arg,
  Ctx,
} from "type-graphql";
import "reflect-metadata";
import admin from "firebase-admin";
import { expiresIn, defaultCookieOptions } from "../utils/defaultCookies";
import { ContextType } from ".";
import { uuid } from "uuidv4";
import { makeRPCCall, MetadataInput } from "../utils/handleUnaryGrpc";
import { AuthServiceClient } from "../protos/auth_grpc_pb";
import {
  CheckStateResponse,
  CheckUsernameAvailabilityRequest,
  CheckUsernameAvailabilityResponse,
} from "../protos/auth_pb";
import { credentials } from "grpc";
import { Empty } from "../protos/utils_pb";
@ObjectType()
class UserInitStatus {
  constructor(value: boolean, cookie: string) {
    this.initialised = value;
    this.cookie = cookie;
  }
  @Field()
  initialised: boolean;

  @Field()
  cookie: string;
}

@ObjectType()
class UsernameAvailability {
  constructor(value: boolean) {
    this.available = value;
  }
  @Field()
  available: boolean;
}

@Resolver()
export class LoginClass {
  @Query((returns) => UsernameAvailability)
  async checkUsername(
    @Arg("username") username: string,
    @Ctx() { authClient }: ContextType
  ): Promise<UsernameAvailability> {
    const request = new CheckUsernameAvailabilityRequest();
    request.setUsername(username);

    try {
      const result = await makeRPCCall<
        CheckUsernameAvailabilityResponse,
        CheckUsernameAvailabilityRequest
      >(authClient, authClient.checkUsernameAvailability, request);
      return new UsernameAvailability(result.getAvailable());
    } catch {
      throw new Error(`Could not check database`);
    }
  }

  @Mutation((returns) => UserInitStatus)
  async createUserSession(
    @Ctx() { res, authClient: client }: ContextType,
    @Arg("idToken") idToken: string
  ): Promise<UserInitStatus> {
    const empty = new Empty();
    console.log("a");
    console.log(idToken);

    try {
      const cookie = await admin
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      res.cookie("authorization2", cookie, {
        ...defaultCookieOptions,
        expires: new Date(Date.now() + expiresIn),
      });

      const value = await makeRPCCall<CheckStateResponse, Empty>(
        client,
        client.checkUserState,
        empty,
        {
          authorization: cookie,
        }
      );
      return new UserInitStatus(value.getInitialised(), cookie);
    } catch (e) {
      console.log(e);
      throw new Error(`Could not verify your identity. Please try again`);
    }
  }
}
