import {SanitizedUsersQueryParamsType} from "../helpers/sanitizeUsersQueryParams"
import {
    UserPaginationOutputType,
    DetailedUserOutputType,
    AuthenticatedUserOutputType
} from "../input-output-types/user-types"
import {UserDbType} from "../../../db/db-types/user-db-types"
import {ObjectId} from "mongodb"
import {db} from "../../../db/mongo-db"

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

        const users: UserDbType[] = await db.getCollections().userCollection
            .find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount: number = await db.getCollections().userCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: users.map((user: UserDbType) => this.mapToDetailedUser(user))
        }
    },
    async findDetailedUserById(id: string): Promise<DetailedUserOutputType | null> {
        const user: UserDbType | null = await db.getCollections().userCollection.findOne({_id: new ObjectId(id)})
        return user ? this.mapToDetailedUser(user) : null
    },
    async findAuthenticatedUserById(id: string): Promise<AuthenticatedUserOutputType | null> {
        const user: UserDbType | null = await db.getCollections().userCollection.findOne({_id: new ObjectId(id)})
        return user ? this.mapToAuthenticatedUser(user) : null
    },
    mapToDetailedUser({_id, password, ...rest}: UserDbType): DetailedUserOutputType {
        return {
            id: _id.toString(),
            ...rest
        }
    },
    mapToAuthenticatedUser({_id, password, createdAt, ...rest}: UserDbType): AuthenticatedUserOutputType {
        return {
            ...rest,
            userId: _id.toString(),
        }
    }
}
