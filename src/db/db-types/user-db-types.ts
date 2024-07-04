import {WithId} from "mongodb";

export type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
}

// export type EmailConfirmation = WithId<{
//     confirmationCode: string,
//     expirationDate: string,
//     isConfirmed: boolean
// }>

export type PasswordRecovery = {
    recoveryCode: string,
    expirationDate: string,
}

// export type PasswordRecovery = WithId<{
//     recoveryCode: string,
//     expirationDate: string,
// }>

export type UserDbType = WithId<{
    login: string,
    password: string,
    email: string,
    createdAt: string
    emailConfirmation: EmailConfirmation,
    passwordRecovery: PasswordRecovery
}>