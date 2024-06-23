export type LoginOutputControllerType = {
    accessToken: string
}

export type AuthMeUserOutputControllerType = {
    email: string,
    login: string,
    userId: string
}

export type RefreshTokenOutputControllerType = {
    accessToken: string
}