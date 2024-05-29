import {LoginInputType} from "../input-output-types/auth-types";
import {UserDbType} from "../../../db/db-types/user-db-types";
import {authMongoRepository} from "../repository/authMongoRepository";
import {bearerService} from "../../../common/adapters/bearerService";
import {Result, ResultStatus} from "../../../common/types/result-type";
import {cryptoService} from "../../../common/adapters/cryptoService";
import {JwtPayloadType} from "../../../common/types/jwtPayloadType";

export const authService = {
    async login(input: LoginInputType): Promise<Result<string | null>> {
        const user: UserDbType| null = await authMongoRepository.findUserByLoginOrEmail(input.loginOrEmail)
        // ?
        if (!user || !(await cryptoService.compare(input.password, user.password))) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login or password', message: 'Wrong login or password'}],
                data: null
            }
        }

        const jwtPayload: JwtPayloadType = {
            userId: user._id.toString()
        }

        const token: string = bearerService.generateToken(jwtPayload)
        console.log(token)

        return {
            status: ResultStatus.Success,
            data: token
        }
    },
    async authMe(userId: string)  {
        console.log("id", userId)

    }
}