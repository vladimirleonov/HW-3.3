import {Request, Response} from "express";
import {GetDeviceSessionsOutputControllerType} from "../types/outputTypes/securityOutputControllersTypes";
import {HTTP_CODES} from "../../../settings";
import {findAllForOutputType} from "../../auth/types/outputTypes/userDeviceOutputMongoQueryRepositoryTypes";
import {
    UserDeviceMongoQueryRepository
} from "../repository/userDeviceMongoQueryRepository";
import {Result, ResultStatus} from "../../../common/types/result";
import {SecurityService} from "../services/securityService";

class SecurityController {
    securityService: SecurityService
    userDeviceMongoQueryRepository: UserDeviceMongoQueryRepository
    constructor() {
        this.securityService = new SecurityService()
        this.userDeviceMongoQueryRepository = new UserDeviceMongoQueryRepository()
    }
    async getUserDeviceSessions (req: Request, res: Response<GetDeviceSessionsOutputControllerType[]>) {
        try {
            const userId: string | undefined = req.device?.userId
            if (!userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const userSessions: findAllForOutputType[] = await this.userDeviceMongoQueryRepository.findAllForOutput(userId)
            res.status(HTTP_CODES.OK).send(userSessions)
        } catch (err) {
            console.error("getDeviceSessionsController", err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async terminateAllOtherDeviceSessions (req: Request, res: Response) {
        try {
            const deviceId: string | undefined = req.device?.deviceId
            const userId: string | undefined = req.device?.userId
            if (!deviceId || !userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result = await this.securityService.terminateAllOtherDeviceSessions({deviceId, userId})
            if (result.status === ResultStatus.Success) {
                res.status(HTTP_CODES.NO_CONTENT).send()
                return
            }
        } catch (err) {
            console.error("terminateAllOtherDeviceSessionsController", err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async terminateDeviceSession (req: Request, res: Response) {
        try {
            const deviceId: string | undefined = req.params.deviceId
            const userId: string | undefined = req.device?.userId
            if (!deviceId || !userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result = await this.securityService.terminateDeviceSession({deviceId, userId})
            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            } else if (result.status === ResultStatus.Forbidden) {
                res.status(HTTP_CODES.FORBIDDEN).send()
                return
            } else if (result.status === ResultStatus.Success) {
                res.status(HTTP_CODES.NO_CONTENT).send()
                return
            }
        } catch (err) {
            console.error("terminateDeviceSessionController", err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
}

export const securityController = new SecurityController()