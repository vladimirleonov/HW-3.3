import {SanitizedUsersQueryParamsType} from "../helpers/sanitizeUsersQueryParams";
import {
    OutputUserPaginationType,
    UserWithIdAndCreatedAtOutputType,
    UserWithUserIdOutputType
} from "../input-output-types/user-types";
import {UserDbType} from "../../../db/db-types/user-db-types";
import {ObjectId} from "mongodb";
import {db} from "../../../db/mongo-db";

export const userMongoQueryRepository = {
    async findAllForOutput(query: SanitizedUsersQueryParamsType): Promise<OutputUserPaginationType> {
        const searchLoginFilter = query.searchLoginTerm
            ? { login : { $regex: query.searchLoginTerm, $options: 'i' }}
            : {}

        const searchEmailFilter = query.searchEmailTerm
            ? { email : { $regex: query.searchEmailTerm, $options: 'i' }}
            : {}

        const orFilters = [searchLoginFilter, searchEmailFilter]
            .filter(filter => Object.keys(filter).length > 0 );

        const filter = orFilters.length > 0 ? { $or: orFilters } : {}

        const users: UserDbType[] = await db.getCollections().userCollection
            .find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount: number = await db.getCollections().userCollection.countDocuments(filter)
        console.log(query)
        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: users.map((user: UserDbType) => this.mapToOutputWithIdAndCreatedAt(user))
        }
    },
    async findForOutputById(id: string): Promise<{error?: string, user?: UserWithIdAndCreatedAtOutputType}> {
        const user: UserDbType | null = await db.getCollections().userCollection.findOne({_id: new ObjectId(id)})
        if (!user) {
            return {error: 'User not found'}
        }
        return {user: this.mapToOutputWithIdAndCreatedAt(user)}
    },
    async findForOutputWithUserIdWithoutCreatedAt(id: string): Promise<{error?: string, user?: UserWithUserIdOutputType}> {
        const user: UserDbType | null = await db.getCollections().userCollection.findOne({_id: new ObjectId(id)})
        //? check error
        if (!user) {
            return {error: 'User not found'}
        }
        return {user: this.mapToOutputWithUserIdWithoutCreated(user)}
    },
    mapToOutputWithIdAndCreatedAt({_id, password, ...rest}: UserDbType): UserWithIdAndCreatedAtOutputType {
        return {
            id: _id.toString(),
            ...rest
        }
    },
    mapToOutputWithUserIdWithoutCreated({_id, password, createdAt, ...rest}: UserDbType): UserWithUserIdOutputType {
        return {
            ...rest,
            userId: _id.toString(),
        }
    }
}
