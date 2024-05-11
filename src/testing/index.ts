import {Router} from "express";
import {deleteTestingController} from "./controllers/deleteTestingController";

export const testingRouter: Router = Router();

testingRouter.delete('/all-data', deleteTestingController)
