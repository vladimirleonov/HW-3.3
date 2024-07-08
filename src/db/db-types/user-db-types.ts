import {ObjectId, WithId} from "mongodb";
import {HydratedDocument} from "mongoose";

// export type EmailConfirmation = {
//     confirmationCode: string,
//     expirationDate: string,
//     isConfirmed: boolean
// }

export class EmailConfirmation {
    constructor(
        public confirmationCode: string,
        public expirationDate: string,
        public isConfirmed: boolean
    ) {}
}

// export type PasswordRecovery = {
//     recoveryCode: string,
//     expirationDate: string,
// }

export class PasswordRecovery {
    constructor(
        public recoveryCode: string,
        public expirationDate: string,
    ) {}
}

// export type UserDbType = WithId<{
//     login: string,
//     password: string,
//     email: string,
//     createdAt: string
//     emailConfirmation: EmailConfirmation,
//     passwordRecovery: PasswordRecovery
// }>

export class User {
    constructor(
        public _id: ObjectId,
        public login: string,
        public password: string,
        public email: string,
        public createdAt: string,
        public emailConfirmation: EmailConfirmation,
        public passwordRecovery: PasswordRecovery
    ) {}
}

export type UserDocument = HydratedDocument<User>