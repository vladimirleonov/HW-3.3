import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-helpers/test-db"
import {req} from "../../../test-helpers/req";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings";
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers";
import {createUsers} from "../../../test-helpers/dataset-helpers/usersDatasets";
import {userCollection} from "../../../../src/db/mongo-db"
import {OutputUserType} from "../../../../src/features/users/input-output-types/user-types";
import {UserDbType} from "../../../../src/db/db-types/user-db-types";

describe('GET /users', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    //users
    it('- GET users unauthorized', async () => {
        const usersDataset = createUsers()
        await userCollection.insertMany(usersDataset.users)

        await req
            .delete(`${SETTINGS.PATH.USERS}/${usersDataset.users[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ GET users with default query parameters', async () => {
        const usersDataset = createUsers(3)
        await userCollection.insertMany(usersDataset.users)

        const res = await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(200)

        console.log(res.body)

        expect(res.body).toHaveProperty('pagesCount');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('pageSize');
        expect(res.body).toHaveProperty('totalCount');
        expect(res.body).toHaveProperty('items');

        expect(res.body.pagesCount).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(10);
        expect(res.body.totalCount).toBe(usersDataset.users.length);

        expect(res.body.items.length).toBe(usersDataset.users.length)
        res.body.items.forEach((item: OutputUserType, index: number) => {
            expect(item.id).toBe(usersDataset.users[index]._id.toString());
            expect(item.login).toBe(usersDataset.users[index].login);
            expect(item.email).toBe(usersDataset.users[index].email);
            expect(item.createdAt).toBe(usersDataset.users[index].createdAt);
        })
    })
    it('+ GET users with sorting query parameters', async () => {
        const usersDataset = createUsers(3)
        await userCollection.insertMany(usersDataset.users)

        const sortBy: string = 'login'
        const sortDirection = 'asc'

        const res = await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .query({sortBy, sortDirection})
            .expect(200)

        const sortedPosts: UserDbType[] = usersDataset.users.sort((a: UserDbType, b: UserDbType) => a.login.localeCompare(b.login))

        expect(res.body.items.length).toBe(sortedPosts.length)
        res.body.items.forEach((item: OutputUserType, index: number) => {
            expect(item.id).toBe(usersDataset.users[index]._id.toString());
            expect(item.login).toBe(usersDataset.users[index].login);
            expect(item.email).toBe(usersDataset.users[index].email);
            expect(item.createdAt).toBe(usersDataset.users[index].createdAt);
        })
    })
    it('+ GET posts with pagination', async () => {
        const usersDataset = createUsers()
        await userCollection.insertMany(usersDataset.users)

        const pageNumber: number = 2
        const pageSize: number = 3

        const res = await req.get(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .query({pageNumber, pageSize})
            .expect(200)

        console.log(res.body)

        //default sorting by createdAt desc
        const sortedPosts: UserDbType[] = usersDataset.users.sort((a: UserDbType, b: UserDbType) => a.login.localeCompare(b.login))
            .sort((a: UserDbType, b: UserDbType) => b.createdAt.localeCompare(a.createdAt));

        const paginatedPosts: UserDbType[] = sortedPosts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

        expect(res.body.items.length).toBe(paginatedPosts.length)
        res.body.items.forEach((item: OutputUserType, index: number) => {
            expect(item.id).toBe(paginatedPosts[index]._id.toString());
            expect(item.login).toBe(paginatedPosts[index].login);
            expect(item.email).toBe(paginatedPosts[index].email);
            expect(item.createdAt).toBe(paginatedPosts[index].createdAt);
        })
    })
})