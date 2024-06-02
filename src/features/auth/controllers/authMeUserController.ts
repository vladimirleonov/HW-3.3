import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings";
import {AuthMeUserOutputType} from "../input-output-types/auth-types";
import {userMongoQueryRepository} from "../../users/repository/userMongoQueryRepository";

export const authMeUserController = async (req: Request<{}, {}, AuthMeUserOutputType, {}>, res: Response<AuthMeUserOutputType>) => {
    try {
        if(!req.user || !req.user.userId){
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }
        //? result format from repository and naming in repository
        const user = await userMongoQueryRepository.findAuthenticatedUserById(req.user.userId!)
        //? check user
        res.status(HTTP_CODES.OK).send(user!)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}