import {SanitizedUsersQueryParamsType} from "../helpers/sanitizeUsersQueryParams"
import {
    UserPaginationOutputType,
    DetailedUserOutputType,
    AuthenticatedUserOutputType
} from "../input-output-types/user-types"
import {UserModel, UserDbType} from "../../../db/models/user.model"
import {ObjectId, WithId} from "mongodb"

export const userMongoQueryRepository = {
    async findAllForOutput(query: SanitizedUsersQueryParamsType): Promise<UserPaginationOutputType> {
        const searchLoginFilter = query.searchLoginTerm
            ? {login: {$regex: query.searchLoginTerm, $options: 'i'}}
            : {}

        const searchEmailFilter = query.searchEmailTerm
            ? {email: {$regex: query.searchEmailTerm, $options: 'i'}}
            : {}

        const orFilters = [searchLoginFilter, searchEmailFilter]
            .filter(filter => Object.keys(filter).length > 0)

        const filter = orFilters.length > 0 ? {$or: orFilters} : {}

        const users: WithId<UserDbType>[] = await UserModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean()
            .exec()

        const totalCount: number = await UserModel.countDocuments(filter)
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: users.map((user: WithId<UserDbType>) => this.mapToDetailedUser(user))
        }
    },
    async findDetailedUserById(id: string): Promise<DetailedUserOutputType | null> {
        const user: WithId<UserDbType> | null = await UserModel.findOne({_id: new ObjectId(id)}).lean()
        return user ? this.mapToDetailedUser(user) : null
    },
    async findAuthenticatedUserById(id: string): Promise<AuthenticatedUserOutputType | null> {
        const user: WithId<UserDbType> | null = await UserModel.findOne({_id: new ObjectId(id)}).lean()
        return user ? this.mapToAuthenticatedUser(user) : null
    },
    mapToDetailedUser({_id, login, email, createdAt, ...rest}: WithId<UserDbType>): DetailedUserOutputType {
        return {
            id: _id.toString(),
            login,
            email,
            createdAt
        }
    },
    mapToAuthenticatedUser({_id, password, emailConfirmation, createdAt, ...rest}: WithId<UserDbType>): AuthenticatedUserOutputType {
        return {
            ...rest,
            userId: _id.toString(),
        }
    }
}
