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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClass = void 0;
const type_graphql_1 = require("type-graphql");
const handleUnaryGrpc_1 = require("../utils/handleUnaryGrpc");
const user_pb_1 = require("../protos/user_pb");
const class_validator_1 = require("class-validator");
const empty_1 = require("./empty");
let UserCreateInput = class UserCreateInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserCreateInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserCreateInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserCreateInput.prototype, "college", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserCreateInput.prototype, "country", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserCreateInput.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.Min(1),
    __metadata("design:type", Number)
], UserCreateInput.prototype, "year", void 0);
UserCreateInput = __decorate([
    type_graphql_1.InputType()
], UserCreateInput);
let UserUpdateInput = class UserUpdateInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "college", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "country", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.Min(1),
    __metadata("design:type", Number)
], UserUpdateInput.prototype, "year", void 0);
UserUpdateInput = __decorate([
    type_graphql_1.InputType()
], UserUpdateInput);
let UserClass = class UserClass {
    async createLocalUser(payload, { userClient, authToken }) {
        if (!authToken)
            throw new Error(`User is not logged in`);
        try {
            const input = new user_pb_1.CreateLocalPlayerRequest();
            input.setName(payload.name);
            input.setCountry(payload.country);
            input.setCollege(payload.college);
            input.setPhone(payload.phone);
            input.setUsername(payload.username);
            input.setYear(payload.year);
            await handleUnaryGrpc_1.makeRPCCall(userClient, userClient.createLocalPlayer, input, {
                authorization: authToken,
            });
            return new empty_1.Empty();
        }
        catch (e) {
            throw new Error(`Could not create user. Please try again`);
        }
    }
    async updateLocalUser(payload, { userClient, authToken }) {
        if (!authToken)
            throw new Error(`User is not logged in`);
        try {
            const input = new user_pb_1.UpdateLocalPlayerRequest();
            if (payload.name.length > 0)
                input.setName(payload.name);
            if (payload.country.length > 0)
                input.setCountry(payload.country);
            if (payload.college.length > 0)
                input.setCollege(payload.college);
            if (payload.phone.length > 0)
                input.setPhone(payload.phone);
            if (payload.year > 0)
                input.setYear(payload.year);
            await handleUnaryGrpc_1.makeRPCCall(userClient, userClient.updateLocalPlayer, input, {
                authorization: authToken,
            });
            return new empty_1.Empty();
        }
        catch (e) {
            throw new Error(`Could not update user. Please try again`);
        }
    }
};
__decorate([
    type_graphql_1.Mutation((returns) => empty_1.Empty),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserCreateInput, Object]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "createLocalUser", null);
__decorate([
    type_graphql_1.Mutation((returns) => empty_1.Empty),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "updateLocalUser", null);
UserClass = __decorate([
    type_graphql_1.Resolver()
], UserClass);
exports.UserClass = UserClass;
//# sourceMappingURL=user.js.map