import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {testingService} from "../services/testingService"

class TestingController {
    async deleteTestingController (req: Request, res: Response) {
        try {
        await testingService.deleteAllData()

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    }
}

export const testingController: TestingController = new TestingController()