import {TestingRepository} from "../repository/testingRepository"
import {Result, ResultStatus} from "../../../common/types/result"

export class TestingService {
    testingRepository: TestingRepository
    constructor() {
        this.testingRepository = new TestingRepository
    }
    async deleteAllData(): Promise<Result<boolean>> {
        const isDeletes: boolean = await this.testingRepository.deleteAllData()
        return {
            status: ResultStatus.Success,
            data: isDeletes
        }
    }
}

// export const testingService: TestingService = new TestingService()