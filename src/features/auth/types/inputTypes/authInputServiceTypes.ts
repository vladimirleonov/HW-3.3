export type LoginInputServiceType = {
    loginOrEmail: string
    password: string
}

export type RegistrationInputServiceType = {
    login: string,
    password: string,
    email: string
}

export type RegistrationConfirmationInputServiceType = {
    code: string
}

export type RegistrationEmailResendingInputServiceType = {
    email: string
}