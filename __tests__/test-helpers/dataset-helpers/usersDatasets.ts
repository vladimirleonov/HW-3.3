import {req} from "../req"
import {SETTINGS} from "../../../src/settings"
import {encodeToBase64} from "../../../src/common/helpers/auth-helpers"
import {AUTH_DATA} from "../../../src/settings"
import {UserDbType} from "../../../src/db/db-types/user-db-types";
import {ObjectId} from "mongodb";

export const createUsers = (count: number = 2) => {
    const users: UserDbType[] = []

    for (let i: number = 0; i < count; i++) {
        const currentDate: string = new Date().toISOString()
        users.push({
            _id: new ObjectId(),
            login: `test${i}`,
            password: 'test',
            email: `test${i}@gmail.com`,
            createdAt: currentDate,
        })
    }
    return {users}
}

export const createUser = () => {
    return {
        _id: new ObjectId(),
        login: 'test',
        email: 'test@gmail.com',
        password: 'test',
        createdAt: new Date().toISOString(),
    }
}


// export const createUser = async () => {
//     const res = await req.post(SETTINGS.PATH.USERS)
//         // .auth(ADMIN_LOGIN, ADMIN_PASS)
//         .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
//         .send({
//             login: 'test',
//             email: 'test@gmail.com',
//             password: 'test'
//         }).expect(200)
//     return res.body
// }

// export const createUsers = async (count: number = 2) => {
//     const users: any = []
//
//     for(let i = 0; i < count; i++) {
//         const res = await req.post(SETTINGS.PATH.USERS)
//         .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
//         .send({
//             login: 'test' + i,
//             email: `test${i}@gmail.com`,
//             password: 'test'
//         }).expect(200)
//
//         users.push(res.body)
//     }
//     return users
// }