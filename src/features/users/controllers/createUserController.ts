import {Request, Response} from "express"
import {UserBodyInputType, DetailedUserOutputType} from "../input-output-types/user-types"
import {userService} from "../services/userService"
import {userMongoQueryRepository} from "../repository/userMongoQueryRepository"
import {HTTP_CODES} from "../../../settings"
import {ErrorsMessagesType} from "../../../common/types/errorsMessages"
import {Result, ResultStatus} from "../../../common/types/result-type"

export const createUserController = async (req: Request<{}, DetailedUserOutputType | ErrorsMessagesType, UserBodyInputType>, res: Response<DetailedUserOutputType | ErrorsMessagesType>) => {
    try {
        const result: Result<string | null> = await userService.createUser(req.body)
        // ?
        if (result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.BAD_REQUEST).send({
                errorsMessages: result.extensions!
            })
            return
        }

        //?
        const user: DetailedUserOutputType | null = await userMongoQueryRepository.findDetailedUserById(result.data!)

        //?
        res.status(HTTP_CODES.CREATED).send(user!)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}