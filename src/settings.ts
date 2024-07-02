import {config} from "dotenv"

config()

export const SETTINGS = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    PATH: {
        AUTH: '/auth',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        TESTING: '/testing',
        SECURITY: '/security'
    },
    EMAIL: {
        USER: process.env.EMAIL_USER || '',
        PASSWORD: process.env.EMAIL_PASSWORD || '',
        HOST: process.env.EMAIL_HOST || '',
        PORT: process.env.EMAIL_PORT || '587'
    },
    MONGO_URL: process.env.MONGO_URL,
    // MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    // DB_NAME: process.env.DB_NAME || '',
    // BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
    // POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
    // USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
    // COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || '',
    // REVOKED_TOKEN_COLLECTION_NAME: process.env.REVOKED_TOKEN_COLLECTION_NAME || '',
    // USER_DEVICE_COLLECTION_NAME: process.env.USER_DEVICE_COLLECTION_NAME || '',
    // API_ACCESS_LOGS_COLLECTION_NAME: process.env.API_ACCESS_LOGS_COLLECTION_NAME || '',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
}

export const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
}

type AuthDataType = {
    ADMIN_AUTH: string,
    FAKE_AUTH: string
}

export const AUTH_DATA: AuthDataType = {
    ADMIN_AUTH: 'admin:qwerty',
    FAKE_AUTH: 'username:password'
}
