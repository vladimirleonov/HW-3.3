export type LoginInputServiceType = {
    loginOrEmail: string
    password: string
    ip: string
    deviceName: string
    refreshToken: string
}

export type RegistrationInputServiceType = {
    login: string
    password: string
    email: string
}

export type RegistrationConfirmationInputServiceType = {
    code: string
}

export type RegistrationEmailResendingInputServiceType = {
    email: string
}

export type LogoutInputServiceType = {
    deviceId: string
    iat: string
}

export type RefreshTokenInputServiceType = {
    deviceId: string,
    userId: string,
    iat: string
}