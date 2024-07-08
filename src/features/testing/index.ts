import {Router} from "express"
import {testingController} from "./controllers/deleteTestingController"

export const testingRouter: Router = Router()

testingRouter.delete('/all-data', testingController.deleteTestingController)
