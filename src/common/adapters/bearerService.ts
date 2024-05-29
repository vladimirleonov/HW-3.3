import jwt, {JwtPayload} from 'jsonwebtoken'
import {SETTINGS} from "../../settings";

export const bearerService = {
    generateToken (payload: Object): string {
        return jwt.sign(payload, SETTINGS.JWT_SECRET, {expiresIn: '7d'})
    },
    verifyToken(token: string): string | JwtPayload  {
        return jwt.verify(token, SETTINGS.JWT_SECRET)
    },
    decode(token: string): string | JwtPayload | null {
        return jwt.decode(token)
    }
}