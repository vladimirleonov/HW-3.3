export type LoginInputType = {
    loginOrEmail: string
    password: string
}

export type LoginOutputType = {
    accessToken: string
}

export type AuthMeUserOutputType = {
    email: string,
    login: string,
    userId: string
}