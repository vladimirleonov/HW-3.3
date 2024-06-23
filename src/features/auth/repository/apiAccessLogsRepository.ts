import {db} from "../../../db/mongo-db";
import {InsertOneResult, WithId} from "mongodb";

export const apiAccessLogsRepository = {
    async createApiAccessLog({ip, originUrl}: {ip: string, originUrl: string}) {
        const insertedInfo: InsertOneResult<ApiAccessLogDbType> = await db.getCollections().apiAccessLogsCollection.insertOne({
            ip,
            URL: originUrl,
            date: new Date(),
        })

        return insertedInfo.insertedId
    },
    async countApiLogsByIpAndOriginUrl ({ip, originUrl}: {ip: string, originUrl: string}): Promise<number> {
        const tenSecondsAgo: Date = new Date(new Date().getTime() - 10000);

        return db.getCollections().apiAccessLogsCollection.countDocuments({
            ip,
            URL: originUrl,
            date: {
                $gte: tenSecondsAgo
            }
        })
    }
}

// export const apiAccessLogsRepository = {
//     async createApiAccessLog({ ip, originUrl }: { ip: string; originUrl: string }) {
//         const insertedInfo: InsertOneResult<ApiAccessLogDbType> = await db.getCollections().apiAccessLogsCollection.insertOne({
//             ip,
//             URL: originUrl,
//             date: new Date(),
//         });
//
//         return insertedInfo.insertedId;
//     },
//
//     async countApiLogsByIpAndOriginUrl({ ip, originUrl }: { ip: string; originUrl: string }): Promise<number> {
//         const tenSecondsAgo: Date = new Date(Date.now() - 10000);
//
//         return db.getCollections().apiAccessLogsCollection.countDocuments({
//             ip,
//             URL: originUrl,
//             date: {
//                 $gte: tenSecondsAgo
//             }
//         });
//     }
// };