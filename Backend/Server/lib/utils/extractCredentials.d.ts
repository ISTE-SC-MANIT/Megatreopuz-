import Express from "express";
interface UserCredentials {
    accessToken?: string;
    refreshToken: string;
}
export default function extractCredentials(req: Express.Request): UserCredentials | null;
export {};
