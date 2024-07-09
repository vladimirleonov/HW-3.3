import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {TestingService} from "../services/testingService"

class TestingController {
    testingService: TestingService
    constructor() {
    this.testingService = new TestingService()
    }
    async deleteTestingController (req: Request, res: Response) {
        try {
        await this.testingService.deleteAllData()

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
    }
}

export const testingController: TestingController = new TestingController()