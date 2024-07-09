import {Router} from "express"
import {refreshTokenAuthMiddleware} from "../../common/middlewares/refreshTokenAuthMiddleware";
import {securityController} from "./controllers/securityController";

export const securityRouter: Router = Router()

securityRouter.get('/devices', refreshTokenAuthMiddleware, securityController.getUserDeviceSessions.bind(securityController))
securityRouter.delete('/devices', refreshTokenAuthMiddleware, securityController.terminateAllOtherDeviceSessions.bind(securityController))
securityRouter.delete('/devices/:deviceId', refreshTokenAuthMiddleware, securityController.terminateDeviceSession.bind(securityController))