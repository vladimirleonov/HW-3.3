import {config} from "dotenv";

config();

export const SETTINGS = {
    PORT: process.env.PORT,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing',
    }
}

export const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

type AuthDataType = {
    ADMIN_AUTH: string,
    FAKE_AUTH: string
}

export const AUTH_DATA: AuthDataType = {
    ADMIN_AUTH: 'admin:qwerty',
    FAKE_AUTH: 'username:password'
}

// type AuthSettingsType = {
//     VALID_BASE64_CREDENTIALS: string
//     INVALID_BASE64_CREDENTIALS: string
// }

// export const AUTH_SETTINGS: AuthSettingsType = {
//     VALID_BASE64_CREDENTIALS: Buffer.from(ADMIN_AUTH_DATA).toString('base64'),
//     INVALID_BASE64_CREDENTIALS: Buffer.from(FAKE_AUTH_DATA).toString('base64')
// }

// export const TEST_SETTINGS = {
//     VALID_CREDENTIALS: Buffer.from('admin:qwerty').toString('base64'),
//     INVALID_CREDENTIALS: Buffer.from('username:password').toString('base64')
// };

