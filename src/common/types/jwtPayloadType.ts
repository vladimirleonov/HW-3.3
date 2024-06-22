export type JwtAccessTokenPayloadCustomType = {
    userId: string,
}

export type JwtRefreshTokenPayloadCustomType = {
    userId: string,
    deviceId: string
}

// export type JwtPayloadCustomType = {
//     userId: string,
//     deviceId?: string
// }