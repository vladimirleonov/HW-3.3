import {ObjectId} from "mongodb"

type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
}

export type UserDbType = {
    _id: ObjectId,
    login: string,
    password: string,
    email: string,
    createdAt: string
    emailConfirmation: EmailConfirmation,
}