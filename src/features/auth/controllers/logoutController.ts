import {Request, Response} from "express";
import {HTTP_CODES} from "../../../settings";
import {Result, ResultStatus} from "../../../common/types/result";
import {authService} from "../services/authService";

export const logoutController = async (req: Request, res: Response) => {
    try {
        // const refreshToken = req.cookies?.refreshToken
        // if (!refreshToken) {
        //     res.status(HTTP_CODES.UNAUTHORIZED).send("Refresh token is missing")
        //     return
        // }

        const deviceId = req.device?.deviceId
        const iat = req.device?.iat
        if (!deviceId || !iat) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const result: Result = await authService.logout({deviceId, iat})
        if (result.status === ResultStatus.Unauthorized) {
            console.error("Invalid or expired refresh token", result.extensions)
            res.status(HTTP_CODES.UNAUTHORIZED).send("Invalid or expired refresh token")
            return
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.UNAUTHORIZED).send()
    }
}


// export const logoutController = async (req: Request, res: Response) => {
//     try {
//         const refreshToken = req.cookies?.refreshToken
//         if (!refreshToken) {
//             res.status(HTTP_CODES.UNAUTHORIZED).send("Refresh token is missing")
//             return
//         }
//
//         const result: Result = await authService.logout(refreshToken)
//         if (result.status === ResultStatus.Unauthorized) {
//             console.error("Invalid or expired refresh token", result.extensions)
//             res.status(HTTP_CODES.UNAUTHORIZED).send("Invalid or expired refresh token")
//             return
//         }
//
//         res.clearCookie('refreshToken', {
//             httpOnly: true,
//             secure: true,
//             //secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });
//
//         res.status(HTTP_CODES.NO_CONTENT).send()
//     } catch (err) {
//         console.error(err)
//         res.status(HTTP_CODES.UNAUTHORIZED).send()
//     }
// }