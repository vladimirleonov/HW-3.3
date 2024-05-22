import {blogCollection, postCollection} from "../../../db/mongo-db"

export const testingRepository = {
    async deleteAllData(): Promise<{ success?: boolean }> {
        try {
            await blogCollection.deleteMany({})
            await postCollection.deleteMany({})

            return {success: true}
        } catch (err) {
            throw new Error('Failed to delete all data')
        }
    }
}