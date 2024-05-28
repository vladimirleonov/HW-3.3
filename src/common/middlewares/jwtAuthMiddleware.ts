import {Request, Response, NextFunction} from 'express'
import {HTTP_CODES} from "../../settings";

const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers.authorization)

    if(! req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }


}