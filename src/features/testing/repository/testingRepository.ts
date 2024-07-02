import {db} from "../../../db/mongoose-db-connection"

export const testingRepository = {
    async deleteAllData(): Promise<boolean> {
        return db.drop()
    }
}


// export const testingRepository = {
//     async deleteAllData(): Promise<boolean> {
//         const blogDeleteResult: DeleteResult = await db.getCollections().blogCollection.deleteMany({})
//         const postDeleteResult: DeleteResult = await db.getCollections().postCollection.deleteMany({})
//         const userDeleteResult: DeleteResult = await db.getCollections().userCollection.deleteMany({})

//         return !(blogDeleteResult.deletedCount === 0 || postDeleteResult.deletedCount === 0 || userDeleteResult.deletedCount === 0)
//     }
// }