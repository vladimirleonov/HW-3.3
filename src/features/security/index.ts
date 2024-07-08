import {Router} from "express"
import {refreshTokenAuthMiddleware} from "../../common/middlewares/refreshTokenAuthMiddleware";
import {securityController} from "./controllers/securityController";

export const securityRouter: Router = Router()

securityRouter.get('/devices', refreshTokenAuthMiddleware, securityController.getUserDeviceSessions)
securityRouter.delete('/devices', refreshTokenAuthMiddleware, securityController.terminateAllOtherDeviceSessions)
securityRouter.delete('/devices/:deviceId', refreshTokenAuthMiddleware, securityController.terminateDeviceSession)