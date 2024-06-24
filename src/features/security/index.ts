import {Router} from "express"
import {
    getUserDeviceSessionsController
} from "./controllers/getUserDeviceSessionsController";
import {terminateAllOtherDeviceSessionsController} from "./controllers/terminateAllOtherDeviceSessionsController";
import {terminateDeviceSessionController} from "./controllers/terminateDeviceSessionController";
import {refreshTokenAuthMiddleware} from "../../common/middlewares/refreshTokenAuthMiddleware";

export const securityRouter: Router = Router()

securityRouter.get('/devices', refreshTokenAuthMiddleware, getUserDeviceSessionsController)
securityRouter.delete('/devices', refreshTokenAuthMiddleware, terminateAllOtherDeviceSessionsController)
securityRouter.delete('/devices/:deviceId', refreshTokenAuthMiddleware, terminateDeviceSessionController)