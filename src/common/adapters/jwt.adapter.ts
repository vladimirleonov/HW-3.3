import jwt, {JwtPayload} from 'jsonwebtoken'
import {SETTINGS} from "../../settings"

export const jwtAdapter = {
    generateToken(payload: Object, expiresIn: string = '7d'): string {
        return jwt.sign(payload, SETTINGS.JWT_SECRET, {expiresIn})
    },
    verifyToken(token: string): string | JwtPayload {
        return jwt.verify(token, SETTINGS.JWT_SECRET)
    },
    decode(token: string): string | JwtPayload | null {
        return jwt.decode(token)
    }
}