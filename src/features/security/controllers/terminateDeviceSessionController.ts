// import {Request, Response} from "express";
// import {HTTP_CODES} from "../../../settings";
// import {Result, ResultStatus} from "../../../common/types/result";
// import {securityService} from "../services/securityService";
//
// export const terminateDeviceSessionController = async (req: Request, res: Response) => {
//     try {
//         const deviceId: string | undefined = req.params.deviceId
//         const userId: string | undefined = req.device?.userId
//         if (!deviceId || !userId) {
//             res.status(HTTP_CODES.UNAUTHORIZED).send()
//             return
//         }
//
//         const result: Result = await securityService.terminateDeviceSession({deviceId, userId})
//         if (result.status === ResultStatus.NotFound) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         } else if (result.status === ResultStatus.Forbidden) {
//             res.status(HTTP_CODES.FORBIDDEN).send()
//             return
//         } else if (result.status === ResultStatus.Success) {
//             res.status(HTTP_CODES.NO_CONTENT).send()
//             return
//         }
//     } catch (err) {
//         console.error("terminateDeviceSessionController", err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }