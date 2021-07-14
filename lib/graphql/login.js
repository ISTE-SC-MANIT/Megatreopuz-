"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginClass = void 0;
const type_graphql_1 = require("type-graphql");
require("reflect-metadata");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const defaultCookies_1 = require("../utils/defaultCookies");
const handleUnaryGrpc_1 = require("../utils/handleUnaryGrpc");
const auth_pb_1 = require("../protos/auth_pb");
const utils_pb_1 = require("../protos/utils_pb");
let UserInitStatus = class UserInitStatus {
    constructor(value) {
        this.initialised = value;
    }
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], UserInitStatus.prototype, "initialised", void 0);
UserInitStatus = __decorate([
    type_graphql_1.ObjectType(),
    __metadata("design:paramtypes", [Boolean])
], UserInitStatus);
let UsernameAvailability = class UsernameAvailability {
    constructor(value) {
        this.available = value;
    }
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], UsernameAvailability.prototype, "available", void 0);
UsernameAvailability = __decorate([
    type_graphql_1.ObjectType(),
    __metadata("design:paramtypes", [Boolean])
], UsernameAvailability);
let LoginClass = class LoginClass {
    async checkUsername(username, { authClient }) {
        const request = new auth_pb_1.CheckUsernameAvailabilityRequest();
        request.setUsername(username);
        try {
            const result = await handleUnaryGrpc_1.makeRPCCall(authClient, authClient.checkUsernameAvailability, request);
            return new UsernameAvailability(result.getAvailable());
        }
        catch (_a) {
            throw new Error(`Could not check database`);
        }
    }
    async createUserSession({ res, authClient: client }, idToken) {
        const empty = new utils_pb_1.Empty();
        try {
            const cookie = await firebase_admin_1.default
                .auth()
                .createSessionCookie(idToken, { expiresIn: defaultCookies_1.expiresIn });
            res.cookie("authorization", cookie, {
                ...defaultCookies_1.defaultCookieOptions,
                expires: new Date(Date.now() + defaultCookies_1.expiresIn),
            });
            const value = await handleUnaryGrpc_1.makeRPCCall(client, client.checkUserState, empty, {
                authorization: cookie,
            });
            return new UserInitStatus(value.getInitialised());
        }
        catch (e) {
            throw new Error(`Could not verify your identity. Please try again`);
        }
    }
};
__decorate([
    type_graphql_1.Query((returns) => UsernameAvailability),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LoginClass.prototype, "checkUsername", null);
__decorate([
    type_graphql_1.Mutation((returns) => UserInitStatus),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("idToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LoginClass.prototype, "createUserSession", null);
LoginClass = __decorate([
    type_graphql_1.Resolver()
], LoginClass);
exports.LoginClass = LoginClass;
//# sourceMappingURL=login.js.map