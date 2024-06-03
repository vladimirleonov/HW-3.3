import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {base64Service} from "../../../src/common/adapters/base64Service"
import {createUsers} from "../../helpers/user-helpers"
import {DetailedUserOutputType} from "../../../src/features/users/input-output-types/user-types"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-db"

describe('GET /users', () => {
    beforeAll(async () => {
        const mongoServer: MongoMemoryServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    afterAll(async () => {
        await db.stop()
    })
    beforeEach(async () => {
        await db.drop()
    })
    it('- GET users unauthorized: STATUS 401', async () => {
        await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- GET users empty array: STATUS 200', async () => {
        await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.OK)
    })
    it('+ GET users with default query parameters: STATUS 200', async () => {
        const users: DetailedUserOutputType[] = await createUsers()

        const res = await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.OK)

        expect(res.body.pagesCount).toBe(1)
        expect(res.body.page).toBe(1)
        expect(res.body.pageSize).toBe(10)
        expect(res.body.totalCount).toBe(users.length)

        expect(res.body.items.length).toBe(users.length)
        res.body.items.forEach((item: DetailedUserOutputType, index: number) => {
            expect(item.id).toBe(users[index].id)
            expect(item.login).toBe(users[index].login)
            expect(item.email).toBe(users[index].email)
            expect(item.createdAt).toBe(users[index].createdAt)
        })
    })
    it('+ GET users with sorting query parameters: STATUS 200', async () => {
        const users: DetailedUserOutputType[] = await createUsers()

        const sortBy: string = 'login'
        const sortDirection = 'asc'

        const res = await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .query({sortBy, sortDirection})
            .expect(200)

        const sortedUsers: DetailedUserOutputType[] = users.sort((a: DetailedUserOutputType, b: DetailedUserOutputType) => a.login.localeCompare(b.login))

        expect(res.body.items.length).toBe(sortedUsers.length)
        res.body.items.forEach((item: DetailedUserOutputType, index: number) => {
            expect(item.id).toBe(sortedUsers[index].id)
            expect(item.login).toBe(sortedUsers[index].login)
            expect(item.email).toBe(sortedUsers[index].email)
            expect(item.createdAt).toBe(sortedUsers[index].createdAt)
        })
    })
    it('+ GET users with pagination: STATUS 200', async () => {
        const users: DetailedUserOutputType[] = await createUsers(7)

        const pageNumber: number = 2
        const pageSize: number = 3

        const res = await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .query({pageNumber, pageSize})
            .expect(200)

        const paginatedPosts: DetailedUserOutputType[] = users.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

        expect(res.body.items.length).toBe(paginatedPosts.length)
        res.body.items.forEach((item: DetailedUserOutputType, index: number) => {
            expect(item.id).toBe(paginatedPosts[index].id)
            expect(item.login).toBe(paginatedPosts[index].login)
            expect(item.email).toBe(paginatedPosts[index].email)
            expect(item.createdAt).toBe(paginatedPosts[index].createdAt)
        })
    })
})