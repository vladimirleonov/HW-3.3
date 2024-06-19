import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {userMongoQueryRepository} from "../../users/repository/userMongoQueryRepository"
import {AuthenticatedUserOutputType} from "../../users/input-output-types/user-types";
import {AuthMeUserOutputControllerType} from "../types/outputTypes/authOutputControllersTypes";

export const authMeController = async (req: Request<{}, {}, AuthMeUserOutputControllerType, {}>, res: Response<AuthMeUserOutputControllerType>) => {
    try {
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
        console.error('authMeController', err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}