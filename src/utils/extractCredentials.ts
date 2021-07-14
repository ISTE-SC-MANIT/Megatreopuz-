import Express from "express";

interface UserCredentials {
  accessToken?: string;
  refreshToken: string;
}

export default function extractCredentials(
  req: Express.Request
): UserCredentials | null {
  // Search cookies
  if (req.cookies.refreshToken) {
    const o: UserCredentials = {
      refreshToken: req.cookies.refreshToken,
    };
    if (req.cookies.accessToken) o.accessToken = req.cookies.accessToken;
    return o;
  }
  // Search headers
  const headerRefreshToken = req.get("refreshToken");
  if (headerRefreshToken) {
    const o: UserCredentials = {
      refreshToken: headerRefreshToken,
    };
    const headerAccessToken = req.get("accessToken");
    if (headerAccessToken) o.accessToken = headerAccessToken;
    return o;
  }

  return null;
}
