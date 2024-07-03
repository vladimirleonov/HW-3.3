import {type} from "node:os";

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

type EmailBodyInputServiceType = {
    email: string
}

export type RegistrationEmailResendingInputServiceType = EmailBodyInputServiceType
export type RegistrationPasswordRecoveryInputServiceType = EmailBodyInputServiceType

export type LogoutInputServiceType = {
    deviceId: string
    iat: string
}

export type RefreshTokenInputServiceType = {
    deviceId: string,
    userId: string,
    iat: string
}