import {type} from "node:os";

export type LoginInputControllerType = {
    loginOrEmail: string
    password: string
}

export type RegistrationInputControllerType = {
    login: string,
    password: string,
    email: string
}

export type RegistrationConfirmationInputControllerType = {
    code: string
}

type BaseEmailType = {
    email: string
}

export type RegistrationEmailResendingInputControllerType = BaseEmailType

export type RegistrationPasswordRecoveryInputControllerType = BaseEmailType