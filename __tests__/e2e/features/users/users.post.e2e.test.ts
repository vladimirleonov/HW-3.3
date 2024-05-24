import {req} from "../../../test-helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {AUTH_DATA} from "../../../../src/settings"
import {clearTestDB, closeTestDB, connectToTestDB} from "../../../test-helpers/test-db"
import {InputUserType} from "../../../../src/features/users/input-output-types/user-types";

describe('POST /users', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- POST users unauthorized', async () => {
        const newUser: any = {
            login: 'login',
            email: 'test@gmail.com',
            password: 'test1234',
        }

        await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ POST user with correct input data', async () => {
        const newUser: any = {
            login: 'login',
            email: 'test@gmail.com',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.CREATED)

        console.log(res.body)

        expect(res.body.login).toEqual(newUser.login)
        expect(res.body.email).toEqual(newUser.email)
    })
    it('+ POST user when login not unique', async () => {
        const user1: any = {
            login: 'login',
            email: 'test1@gmail.com',
            password: 'test1234',
        }
        const user2: any = {
            login: 'login',
            email: 'test2@gmail.com',
            password: 'test1234',
        }

        await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(user1)
            .expect(HTTP_CODES.CREATED)

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(user2)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'login',
                message: 'login should be unique'
            }
        )
    })
    it('+ POST user when email not unique', async () => {
        const user1: any = {
            login: 'login1',
            email: 'test@gmail.com',
            password: 'test1234',
        }
        const user2: any = {
            login: 'login2',
            email: 'test@gmail.com',
            password: 'test1234',
        }

        await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(user1)
            .expect(HTTP_CODES.CREATED)

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(user2)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'email',
                message: 'email should be unique'
            }
        )
    })
    it('- POST users when login not passed', async () => {
        const newUser: any = {
            email: 'test@gmail.com',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'login',
                message: 'login is missing or not a string'
            }
        )
    })
    it('- POST USERS when login is not a string', async () => {
        const newUser: any = {
            login: 123 as any,
            email: 'test@gmail.com',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'login',
                message: 'login is missing or not a string'
            }
        )
    })
    it('- POST USERS with incorrect min login length', async () => {
        const newUser: any = {
            login: 'te',
            email: 'test@gmail.com',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'login',
                message: 'login is less than 3 characters long'
            }
        )
    })
    it('- POST USERS with incorrect login', async () => {
        const newUser: any = {
            login: '#4123$1_!',
            email: 'test@gmail.com',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'login',
                message: 'Invalid value'
            }
        )
    })
    it('- POST users when password not passed', async () => {
        const newUser: any = {
            login: 'test',
            email: 'test@gmail.com',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'password',
                message: 'password is missing or not a string'
            }
        )
    })
    it('- POST USERS when password is not a string', async () => {
        const newUser: any = {
            login: 'test',
            email: 'test@gmail.com',
            password: 123 as any,
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'password',
                message: 'password is missing or not a string'
            }
        )
    })
    it('- POST USERS with incorrect min password length', async () => {
        const newUser: any = {
            login: 'test',
            email: 'test@gmail.com',
            password: 'test',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'password',
                message: 'password is less than 6 characters long'
            }
        )
    })
    it('- POST users when email not passed', async () => {
        const newUser: any = {
            login: 'test',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'email',
                message: 'email is missing or not a string'
            }
        )
    })
    it('- POST USERS when email is not a string', async () => {
        const newUser: any = {
            login: 'test',
            email: 123 as any,
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'email',
                message: 'email is missing or not a string'
            }
        )
    })
    it('- POST USERS with incorrect email', async () => {
        const newUser: any = {
            login: 'test',
            email: 'test.com',
            password: 'test1234',
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'email',
                message: 'Invalid value'
            }
        )
    })
    it('- POST USERS with incorrect data (first errors)', async () => {
        const newUser: any = {
            login: "1",
            email: null as any,
            password: 123 as any
        }

        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newUser)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages).toContainEqual({
            field: 'login',
            message: 'login is less than 3 characters long'
        });
        expect(res.body.errorsMessages).toContainEqual({
            field: 'email',
            message: 'email is missing or not a string'
        });
        expect(res.body.errorsMessages).toContainEqual({
            field: 'password',
            message: 'password is missing or not a string'
        });
    })
})