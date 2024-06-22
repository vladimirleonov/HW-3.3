import {JwtPayload} from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
            device?: { deviceId: string; userId: string }
        }
    }
}