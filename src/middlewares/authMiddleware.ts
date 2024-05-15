import {NextFunction, Request, Response} from "express"
import {AUTH_DATA, HTTP_CODES} from "../settings"
import {decodeFromBase64} from "../helpers/auth-helpers"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth: string | undefined = req.headers['authorization']

    if (!auth || !auth.startsWith('Basic ')) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    const buff: Buffer = decodeFromBase64(auth.slice(6)) //<Buffer 61 64 6d 69 6e 3a 71 77 65 72 74 79>
    const decodedAuth: string = buff.toString('utf8') //admin:qwerty

    if (decodedAuth !== AUTH_DATA.ADMIN_AUTH) {
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }

    next()
}