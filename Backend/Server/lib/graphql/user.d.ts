import { ContextType } from ".";
import { Empty } from "./empty";
declare class UserCreateInput {
    name: string;
    username: string;
    college: string;
    country: string;
    phone: string;
    year: number;
}
declare class UserUpdateInput {
    name: string;
    college: string;
    country: string;
    phone: string;
    year: number;
}
export declare class UserClass {
    createLocalUser(payload: UserCreateInput, { userClient, authToken }: ContextType): Promise<Empty>;
    updateLocalUser(payload: UserUpdateInput, { userClient, authToken }: ContextType): Promise<Empty>;
}
export {};
