import {blogCollection, postCollection, userCollection} from "../../../db/mongo-db"
import {DeleteResult} from "mongodb";

export const testingRepository = {
    async deleteAllData(): Promise<boolean> {
        const blogDeleteResult: DeleteResult = await blogCollection.deleteMany({})
        const postDeleteResult: DeleteResult = await postCollection.deleteMany({})
        const userDeleteResult: DeleteResult = await userCollection.deleteMany({})

        return !(blogDeleteResult.deletedCount === 0 || postDeleteResult.deletedCount === 0 || userDeleteResult.deletedCount === 0)
    }
}