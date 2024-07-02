import {
    CountApiAccessLogsByIpAndOriginUrlInputType
} from "../types/inputTypes/apiAccessLogsMongoRepositoryTypes";
import {getTenSecondsAgo} from "../../../common/helpers/getTenSecondsAgo";
import { ApiAccessLogModel, ApiAccessLogDocument } from "../../../db/models/apiAccessLog.model";

export const apiAccessLogsMongoRepository = {
    async save(apiAccessLog: ApiAccessLogDocument) {
        return apiAccessLog.save()
    },
    // async createApiAccessLog({ip, originUrl}: CreateApiAccessLogInputType): Promise<string> {
    //     const insertedInfo: InsertOneResult<ApiAccessLogDbType> = await ApiAccessLogModel.insertOne({
    //         ip,
    //         URL: originUrl,
    //         date: new Date(),
    //     })

    //     return insertedInfo.insertedId.toString()
    // },
    async countApiAccessLogsByIpAndOriginUrl({
                                                ip,
                                                originUrl
                                            }: CountApiAccessLogsByIpAndOriginUrlInputType): Promise<number> {
        const tenSecondsAgo: Date = getTenSecondsAgo();

        return ApiAccessLogModel.countDocuments({
            ip,
            URL: originUrl,
            date: {
                $gte: tenSecondsAgo
            }
        })
    }
}