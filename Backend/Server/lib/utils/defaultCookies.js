"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiresIn = exports.defaultCookieOptions = void 0;
exports.defaultCookieOptions = {
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};
exports.expiresIn = 6.048e8;
//# sourceMappingURL=defaultCookies.js.map