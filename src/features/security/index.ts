import {Router} from "express"
import {getDevicesController} from "./controllers/getDevicesController";
import {terminateDevicesController} from "./controllers/terminateDevicesController";
import {deleteDeviceController} from "./controllers/deleteDeviceController";
import {refreshTokenAuthMiddleware} from "../../common/middlewares/refreshTokenAuthMiddleware";

export const securityRouter: Router = Router()

securityRouter.get('/devices', refreshTokenAuthMiddleware, getDevicesController)
securityRouter.delete('/devices', refreshTokenAuthMiddleware, terminateDevicesController)
securityRouter.delete('/devices/:deviceId', refreshTokenAuthMiddleware, deleteDeviceController)