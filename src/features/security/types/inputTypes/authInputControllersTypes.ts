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

export type RegistrationEmailResendingInputControllerType = {
    email: string
}