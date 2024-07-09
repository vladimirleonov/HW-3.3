// import {Request, Response} from "express";
// import {userDeviceMongoQueryRepository} from "../repository/userDeviceMongoQueryRepository";
// import {HTTP_CODES} from "../../../settings";
// import {GetDeviceSessionsOutputControllerType} from "../types/outputTypes/securityOutputControllersTypes";
// import {findAllForOutputType} from "../../auth/types/outputTypes/userDeviceOutputMongoQueryRepositoryTypes";
//
// export const getUserDeviceSessionsController = async (req: Request, res: Response<GetDeviceSessionsOutputControllerType[]>) => {
//     try {
//         const userId: string | undefined = req.device?.userId
//         if (!userId) {
//             res.status(HTTP_CODES.UNAUTHORIZED).send()
//             return
//         }
//
//         const userSessions: findAllForOutputType[] = await userDeviceMongoQueryRepository.findAllForOutput(userId)
//         res.status(HTTP_CODES.OK).send(userSessions)
//     } catch (err) {
//         console.error("getDeviceSessionsController", err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }