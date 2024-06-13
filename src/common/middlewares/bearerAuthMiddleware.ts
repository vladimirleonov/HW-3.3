import {Request, Response, NextFunction} from 'express'
import {HTTP_CODES} from "../../settings"
import {authService} from "../../features/auth/services/authService";
import {Result, ResultStatus} from "../types/result";
import {JwtPayloadCustomType} from "../types/jwtPayloadType";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization
    if (!authHeader) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    try {
        const result: Result<JwtPayloadCustomType | null> = await authService.checkAccessToken(authHeader)
        if (result.status === ResultStatus.Success) {
            req.user = result.data as JwtPayloadCustomType
            next()
            return
        }

        res.status(HTTP_CODES.UNAUTHORIZED).send()
    } catch (err) {
        console.log("bearerAuthMiddleware", err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}



// export const bearerAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader: string | undefined = req.headers.authorization
//
//     if (!authHeader || authHeader.indexOf('Bearer ') === -1) {
//         res.status(HTTP_CODES.UNAUTHORIZED).send()
//         return
//     }
//
//     const token: string = authHeader.split(' ')[1]
//
//     try {
//         const decoded: JwtPayload = bearerAdapter.verifyToken(token) as JwtPayload
//         req.user = decoded
//         next()
//     } catch (err) {
//         res.status(HTTP_CODES.UNAUTHORIZED).send()
//         return
//     }
// }