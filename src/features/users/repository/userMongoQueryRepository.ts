import {blogCollection, userCollection} from "../../../db/mongo-db"
import {SanitizedUsersQueryParamsType} from "../helpers/sanitizeUsersQueryParams";
import {OutputUserPaginationType, OutputUserType} from "../input-output-types/user-types";
import {UserDbType} from "../../../db/db-types/user-db-types";

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

        const users: UserDbType[] = await userCollection
            .find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount: number = await blogCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: users.map((user: UserDbType) => this.mapToOutput(user))
        }
    },
    mapToOutput({_id, password, ...rest}: UserDbType): OutputUserType {
        return {
            ...rest,
            id: _id.toString()
        }
    }
}
