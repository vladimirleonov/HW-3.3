import {testingRepository} from "../repository/testingRepository";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const testingService =  {
    async deleteAllData (): Promise<Result<boolean>> {
        const isDeletes: boolean = await testingRepository.deleteAllData()
        return {
            status: ResultStatus.Success,
            data: isDeletes
        }
    }
}