import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {SanitizedUsersQueryParamsType, sanitizeUsersQueryParams} from "../helpers/sanitizeUsersQueryParams"
import {UsersQueryParamsInputType, UserPaginationOutputType} from "../input-output-types/user-types"
import {userMongoQueryRepository} from "../repository/userMongoQueryRepository"

export const getUsersController = async (req: Request<{}, UserPaginationOutputType, {}, UsersQueryParamsInputType>, res: Response<UserPaginationOutputType>) => {
    try {
        const sanitizedQuery: SanitizedUsersQueryParamsType = sanitizeUsersQueryParams(req.query)
        const users: UserPaginationOutputType = await userMongoQueryRepository.findAllForOutput(sanitizedQuery)

        res.status(HTTP_CODES.OK).send(users)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}