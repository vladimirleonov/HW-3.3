import {Request, Response} from "express";
import {testingRepository} from "../repository/testingRepository";
import {HTTP_CODES} from "../../settings";

export const deleteTestingController = async (req: Request, res: Response) => {
    const deletedInfo = await testingRepository.deleteAllData()

    if (deletedInfo.error) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}