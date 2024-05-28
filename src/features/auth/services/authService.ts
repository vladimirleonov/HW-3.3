import {LoginInputType} from "../input-output-types/auth-types";
import {UserDbType} from "../../../db/db-types/user-db-types";
import {authMongoRepository} from "../repository/authMongoRepository";
import bcrypt from "bcrypt";
import {ErrorsMessagesType, generateErrorMessage} from "../../../common/helpers/generateErrorMessages";

export const authService = {
    async login(input: LoginInputType): Promise<{success?: boolean, error?: ErrorsMessagesType}> {
        const user: UserDbType| null = await authMongoRepository.findUserByLoginOrEmail(input.loginOrEmail)
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
            return {error: generateErrorMessage('password', 'Wrong login or password')}
        }



        return {success: true}
    }
}