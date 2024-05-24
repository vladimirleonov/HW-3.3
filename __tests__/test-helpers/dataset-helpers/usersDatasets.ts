import {req} from "../req"
import {SETTINGS} from "../../../src/settings"
import { encodeToBase64 } from "../../../src/common/helpers/auth-helpers"
import { AUTH_DATA } from "../../../src/settings"


export const createUser = async () => {
    const res = await req.post(SETTINGS.PATH.USERS)
        // .auth(ADMIN_LOGIN, ADMIN_PASS)
        .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
        .send({
            login: 'test',
            email: 'test@gmail.com',
            password: 'test'
        }).expect(200)
    return res.body
}

export const createUsers = async (count: number = 2) => {
    const users: any = []

    for(let i = 0; i <= count; i++) {
        const res = await req.post(SETTINGS.PATH.USERS)
        .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
        .send({
            login: 'test' + i,
            email: `test${i}@gmail.com`,
            password: 'test'
        }).expect(200)

        users.push(res.body)
    }
    return users
}