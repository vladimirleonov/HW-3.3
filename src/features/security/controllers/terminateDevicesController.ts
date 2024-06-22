import {Request, Response} from "express";
import {securityService} from "../services/securityService";
import {HTTP_CODES} from "../../../settings";
import {Result, ResultStatus} from "../../../common/types/result";

export const terminateDevicesController = async (req: Request, res: Response) => {
    try {
        const deviceId: string | undefined = req.device?.deviceId
        const userId: string | undefined = req.device?.userId
        if(!deviceId || !userId) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const result: Result = await securityService.terminateDevicesExcludedCurrent({deviceId, userId})
        if (result.status === ResultStatus.Success) {
            res.status(HTTP_CODES.NO_CONTENT).send()
            return
        }
    } catch (err) {
        console.log("terminateDevicesController", err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}