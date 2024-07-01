import {db} from "../../../db/mongo-driver-db-connection";
import {InsertOneResult} from "mongodb";
import {
    CountApiAccessLogsByIpAndOriginUrlInputType,
    CreateApiAccessLogInputType
} from "../types/inputTypes/apiAccessLogsMongoRepositoryTypes";
import {getTenSecondsAgo} from "../../../common/helpers/getTenSecondsAgo";

export const apiAccessLogsMongoRepository = {
    async createApiAccessLog({ip, originUrl}: CreateApiAccessLogInputType): Promise<string> {
        const insertedInfo: InsertOneResult<ApiAccessLogDbType> = await db.getCollections().apiAccessLogsCollection.insertOne({
            ip,
            URL: originUrl,
            date: new Date(),
        })

        return insertedInfo.insertedId.toString()
    },
    async countApiAccessLogsByIpAndOriginUrl({
                                                 ip,
                                                 originUrl
                                             }: CountApiAccessLogsByIpAndOriginUrlInputType): Promise<number> {
        const tenSecondsAgo: Date = getTenSecondsAgo();

        return db.getCollections().apiAccessLogsCollection.countDocuments({
            ip,
            URL: originUrl,
            date: {
                $gte: tenSecondsAgo
            }
        })
    }
}