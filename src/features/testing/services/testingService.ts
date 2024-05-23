import {testingRepository} from "../repository/testingRepository";

export const testingService =  {
    async deleteAllData () {
        return testingRepository.deleteAllData()
    }
}