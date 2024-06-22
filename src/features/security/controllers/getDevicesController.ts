import {Request, Response} from "express";
import {GetDevicesOutputControllerType} from "../../auth/types/inputTypes/securityControllerTypes";
import {userDeviceMongoQueryRepository} from "../repository/userDeviceMongoQueryRepository";
import {HTTP_CODES} from "../../../settings";

export const getDevicesController = async (req: Request, res: Response) => {
    try {
        const userId: string | undefined = req.device?.userId
        if (!userId) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const userSessions: GetDevicesOutputControllerType[] = await userDeviceMongoQueryRepository.findAllForOutput(userId)
        res.status(HTTP_CODES.OK).send(userSessions)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}