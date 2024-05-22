import { Request, Response } from "express"
import {InputUserType, OutputUserType} from "../input-output-types/user-types";
import {userService} from "../services/userService";
import {userMongoQueryRepository} from "../repository/userMongoQueryRepository";
import {HTTP_CODES} from "../../../settings";

export const createUserController = async (req: Request<{}, OutputUserType, InputUserType>, res: Response<OutputUserType>) => {
    try {
        const createdUserId: string = await userService.createUser(req.body)

        const foundInfo = await userMongoQueryRepository.findForOutputById(createdUserId)

        res.status(HTTP_CODES.CREATED).send(foundInfo.user)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}