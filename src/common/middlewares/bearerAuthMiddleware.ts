import {Request, Response, NextFunction} from 'express'
import {HTTP_CODES} from "../../settings";
import {bearerService} from "../adapters/bearerService";
import {JwtPayload} from "jsonwebtoken";

export const bearerAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    const token: string = req.headers.authorization.split(' ')[1]

    try {
        const decoded: JwtPayload = bearerService.verifyToken(token) as JwtPayload
        req.user = decoded
        next()
    } catch (err) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }
}