"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractCredentials(req) {
    // Search cookies
    if (req.cookies.refreshToken) {
        const o = {
            refreshToken: req.cookies.refreshToken,
        };
        if (req.cookies.accessToken)
            o.accessToken = req.cookies.accessToken;
        return o;
    }
    // Search headers
    const headerRefreshToken = req.get("refreshToken");
    if (headerRefreshToken) {
        const o = {
            refreshToken: headerRefreshToken,
        };
        const headerAccessToken = req.get("accessToken");
        if (headerAccessToken)
            o.accessToken = headerAccessToken;
        return o;
    }
    return null;
}
exports.default = extractCredentials;
//# sourceMappingURL=extractCredentials.js.map