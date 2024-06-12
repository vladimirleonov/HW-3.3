import {req} from "../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {createUser} from "./user-helpers"
import {LoginOutputControllerType} from "../../../src/features/auth/types/outputTypes/authOutputControllersTypes";

export const loginUser = async (): Promise<LoginOutputControllerType> => {
    await createUser()

    const res = await req.post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
            loginOrEmail: 'test',
            password: 'test1234'
        }).expect(HTTP_CODES.OK)
    return res.body
}