import {NextFunction, Request, Response} from "express";
import {HTTP_CODES} from "../../settings";
import {authService} from "../../features/auth/services/authService";
import {JwtPayload} from "jsonwebtoken";
import {Result, ResultStatus} from "../types/result";
import {unixToISOString} from "../helpers/unixToISOString";

export const refreshTokenAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
        res.status(HTTP_CODES.UNAUTHORIZED).send("Refresh token is missing")
        return
    }

    const result: Result<JwtPayload | null> = await authService.checkRefreshToken(refreshToken)
    //console.log("refreshTokenAuthMiddleware", result.data)
    if (result.status === ResultStatus.Unauthorized) {
        console.error("refreshTokenAuthMiddleware")
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    const { userId, deviceId, iat } = result.data as JwtPayload
    req.device = {
        userId,
        deviceId,
        //?
        iat: unixToISOString(iat)
    }
    console.log("req.refreshTokenPayload", req.device)
    next()
}