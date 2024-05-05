import {setDB} from "../../db/db";

export const testingRepository = {
    async deleteAllData(): Promise<{ error?: string, success?: boolean }> {
        try {
            setDB()
        } catch (err) {
            return {error: "Failed to delete all data"};
        }

        return {success: true}
    }
}