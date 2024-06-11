import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {AuthMeUserOutputType} from "../input-output-types/auth-types"
import {userMongoQueryRepository} from "../../users/repository/userMongoQueryRepository"
import {AuthenticatedUserOutputType} from "../../users/input-output-types/user-types";

export const authMeController = async (req: Request<{}, {}, AuthMeUserOutputType, {}>, res: Response<AuthMeUserOutputType>) => {
    try {
        //? check user
        if (!req.user || !req.user.userId) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }
        const user: AuthenticatedUserOutputType | null = await userMongoQueryRepository.findAuthenticatedUserById(req.user.userId)
        if (!user) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }
        res.status(HTTP_CODES.OK).send(user)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}