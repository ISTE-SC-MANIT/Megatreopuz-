import "reflect-metadata";
import { ContextType } from ".";
declare class UserInitStatus {
    constructor(value: boolean);
    initialised: boolean;
}
declare class UsernameAvailability {
    constructor(value: boolean);
    available: boolean;
}
export declare class LoginClass {
    checkUsername(username: string, { authClient }: ContextType): Promise<UsernameAvailability>;
    createUserSession({ res, authClient: client }: ContextType, idToken: string): Promise<UserInitStatus>;
}
export {};
