import {Request, Response} from "express"
import {testingRepository} from "../repository/testingRepository"
import {HTTP_CODES} from "../../settings"

export const deleteTestingController = async (req: Request, res: Response) => {
    try {
        await testingRepository.deleteAllData()

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
}