import {
    CountApiAccessLogsByIpAndOriginUrlInputType
} from "../types/inputTypes/apiAccessLogsMongoRepositoryTypes";
import {getTenSecondsAgo} from "../../../common/helpers/getTenSecondsAgo";
import { ApiAccessLogModel } from "../../../db/models/apiAccessLog.model";
import {ApiAccessLogDocument} from "../../../db/db-types/api-access-log-db-types";

class ApiAccessLogsMongoRepository {
    async save(apiAccessLog: ApiAccessLogDocument) {
        return apiAccessLog.save()
    }
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

export const apiAccessLogsMongoRepository: ApiAccessLogsMongoRepository = new ApiAccessLogsMongoRepository()


// export const apiAccessLogsMongoRepository = {
//     async save(apiAccessLog: ApiAccessLogDocument) {
//         return apiAccessLog.save()
//     },
//     async countApiAccessLogsByIpAndOriginUrl({
//                                                  ip,
//                                                  originUrl
//                                              }: CountApiAccessLogsByIpAndOriginUrlInputType): Promise<number> {
//         const tenSecondsAgo: Date = getTenSecondsAgo();
//
//         return ApiAccessLogModel.countDocuments({
//             ip,
//             URL: originUrl,
//             date: {
//                 $gte: tenSecondsAgo
//             }
//         })
//     }
// }