// import {Request, Response} from "express";
// import {HTTP_CODES} from "../../../settings";
// import {authService} from "../services/authService";
// import {RefreshTokenOutputServiceType} from "../types/outputTypes/authOutputServiceTypes";
// import {Result, ResultStatus} from "../../../common/types/result";
// import {RefreshTokenOutputControllerType} from "../types/outputTypes/authOutputControllersTypes";
//
// export const refreshTokenController = async (req: Request<{}, {}, RefreshTokenOutputControllerType>, res: Response<RefreshTokenOutputControllerType | string>) => {
//     try {
//         const deviceId: string | undefined = req.device?.deviceId
//         const userId: string | undefined = req.device?.userId
//         const iat: string | undefined = req.device?.iat
//
//         if (!deviceId || !userId || !iat) {
//             res.status(HTTP_CODES.UNAUTHORIZED).send()
//             return
//         }
//
//         const result: Result<RefreshTokenOutputServiceType | null> = await authService.refreshToken({
//             deviceId,
//             userId,
//             iat
//         })
//         if (result.status === ResultStatus.Unauthorized) {
//             console.error("Invalid or expired refresh token", result.extensions)
//             res.status(HTTP_CODES.UNAUTHORIZED).send("Invalid or expired refresh token")
//             return
//         }
//
//         res.cookie('refreshToken', result.data?.refreshToken, {
//             httpOnly: true,
//             secure: true,
//             // secure: SETTINGS.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });
//
//         res.status(HTTP_CODES.OK).send({
//             accessToken: result.data?.accessToken!,
//         });
//     } catch (err) {
//         console.error('refreshTokenController', err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }