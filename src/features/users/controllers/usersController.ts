import {Request, Response} from "express"
import {
    DetailedUserOutputType, UserBodyInputType,
    UserPaginationOutputType,
    UsersQueryParamsInputType
} from "../input-output-types/user-types"
import {SanitizedUsersQueryParamsType, sanitizeUsersQueryParams} from "../helpers/sanitizeUsersQueryParams"
import {UserMongoQueryRepository} from "../repository/userMongoQueryRepository"
import {HTTP_CODES} from "../../../settings"
import {ErrorsMessagesType} from "../../../common/types/errorMessageType"
import {Result, ResultStatus} from "../../../common/types/result"
import {UserService} from "../services/userService"
import {IdParamInputType} from "../../../common/input-output-types/common-types"

class UsersController {
    userMongoQueryRepository: UserMongoQueryRepository
    userService: UserService
    constructor() {
        this.userMongoQueryRepository = new UserMongoQueryRepository()
        this.userService = new UserService()
    }
    async getUsers (req: Request<{}, UserPaginationOutputType, {}, UsersQueryParamsInputType>, res: Response<UserPaginationOutputType>) {
        try {
            const sanitizedQuery: SanitizedUsersQueryParamsType = sanitizeUsersQueryParams(req.query)
            const users: UserPaginationOutputType = await this.userMongoQueryRepository.findAllForOutput(sanitizedQuery)

            res.status(HTTP_CODES.OK).send(users)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async createUser (req: Request<{}, DetailedUserOutputType, UserBodyInputType>, res: Response<DetailedUserOutputType | ErrorsMessagesType>) {
        try {
            const result: Result<string | null> = await this.userService.createUser(req.body)
            // ?
            if (result.status === ResultStatus.BadRequest) {
                res.status(HTTP_CODES.BAD_REQUEST).send({
                    errorsMessages: result.extensions!
                })
                return
            }

            //?
            const user: DetailedUserOutputType | null = await this.userMongoQueryRepository.findDetailedUserById(result.data!)

            //?
            res.status(HTTP_CODES.CREATED).send(user!)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async deleteUser (req: Request<IdParamInputType>, res: Response) {
        try {
            const result: Result<boolean> = await this.userService.deleteUser(req.params.id)

            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.NO_CONTENT).send()
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
}

export const usersController = new UsersController()