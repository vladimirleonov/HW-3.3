import {db} from "./mongo-db"

export const setupIndexes = async () => {
    await db.getCollections().userDeviceCollection.createIndex(
        { exp: 1 },
        { expireAfterSeconds: 60 }
    )
}