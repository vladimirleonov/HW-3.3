import {NextFunction, Request, Response} from "express";
import {HTTP_CODES} from "../../settings";
import {authService} from "../../features/auth/services/authService";
import {JwtPayload} from "jsonwebtoken";
import {Result, ResultStatus} from "../types/result";

export const refreshTokenAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken  = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    const result: Result<JwtPayload | null> = authService.checkRefreshToken(refreshToken)
    //console.log("refreshTokenAuthMiddleware", result.data)
    if (result.status === ResultStatus.Unauthorized) {
        console.error("refreshTokenAuthMiddleware")
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    const { userId, deviceId } = result.data as JwtPayload
    req.device = { userId, deviceId }
    console.log("req.refreshTokenPayload", req.device)
    next()
}