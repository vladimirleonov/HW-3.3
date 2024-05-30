import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings";
import {AuthMeUserOutputType} from "../input-output-types/auth-types";
import {userMongoQueryRepository} from "../../users/repository/userMongoQueryRepository";

export const authMeUserController = async (req: Request<{}, {}, AuthMeUserOutputType, {}>, res: Response<AuthMeUserOutputType>) => {
    console.log(req.user)
    if(!req.user || !req.user.userId){
        res.status(HTTP_CODES.UNAUTHORIZED).send()
        return
    }
    //? result format from repository and naming in repository
    const foundInfo = await userMongoQueryRepository.findForOutputWithUserIdWithoutCreatedAt(req.user.userId!)
    //? check user
    res.status(HTTP_CODES.OK).send(foundInfo.user)
}