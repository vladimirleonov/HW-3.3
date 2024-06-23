import {Request, Response, NextFunction} from 'express'
import {HTTP_CODES} from "../../settings"
import {authService} from "../../features/auth/services/authService";
import {Result, ResultStatus} from "../types/result";
import {JwtAccessTokenPayloadCustomType} from "../types/jwtPayloadType";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization
    if (!authHeader) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    try {
        const result: Result<JwtAccessTokenPayloadCustomType | null> = await authService.checkAccessToken(authHeader)
        if (result.status === ResultStatus.Success) {
            req.user = result.data as JwtAccessTokenPayloadCustomType
            next()
            return
        }

        res.status(HTTP_CODES.UNAUTHORIZED).send()
    //?
    } catch (err) {
        console.log("authMiddleware", err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}