import {req} from "./req";
import {HTTP_CODES, SETTINGS} from "../../src/settings";
import {LoginOutputType} from "../../src/features/auth/input-output-types/auth-types";
import {createUser} from "./user-helpers";

export const loginUser = async (): Promise<LoginOutputType> => {
    await createUser()

    const res = await req.post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
            loginOrEmail: 'test',
            password: 'test1234'
        }).expect(HTTP_CODES.OK)
    return res.body
}