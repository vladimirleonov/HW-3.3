import {req} from "./req"
import {HTTP_CODES, SETTINGS} from "../../src/settings"
import {base64Adapter} from "../../src/common/adapters/base64.adapter"
import {AUTH_DATA} from "../../src/settings"
import {DetailedUserOutputType} from "../../src/features/users/input-output-types/user-types"

export const createUser = async (): Promise<DetailedUserOutputType> => {
    const res = await req.post(SETTINGS.PATH.USERS)
        // .auth(ADMIN_LOGIN, ADMIN_PASS)
        .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
        .send({
            login: 'test',
            email: 'test@gmail.com',
            password: 'test1234'
        }).expect(HTTP_CODES.CREATED)
    return res.body
}

export const createUsers = async (count: number = 2): Promise<DetailedUserOutputType[]> => {
    const users: DetailedUserOutputType[] = []

    for (let i = 0; i < count; i++) {
        const res = await req.post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send({
                login: `test${i}`,
                email: `test${i}@gmail.com`,
                password: 'test1234'
            }).expect(HTTP_CODES.CREATED)

        users.push(res.body)
    }
    //sort by default
    const sortedUsers: DetailedUserOutputType[] = users.sort((a: DetailedUserOutputType, b: DetailedUserOutputType) => b.createdAt.localeCompare(a.createdAt))
    return sortedUsers
}


// export const createUsers = (count: number = 2) => {
//     const users: UserDbType[] = []
//
//     for (let i: number = 0; i < count; i++) {
//         const currentDate: string = new Date().toISOString()
//         users.push({
//             _id: new ObjectId(),
//             login: `test${i}`,
//             password: 'test',
//             email: `test${i}@gmail.com`,
//             createdAt: currentDate,
//         })
//     }
//     return {users}
// }
//
// export const createUser = () => {
//     return {
//         _id: new ObjectId(),
//         login: 'test',
//         email: 'test@gmail.com',
//         password: 'test',
//         createdAt: new Date().toISOString(),
//     }
// }