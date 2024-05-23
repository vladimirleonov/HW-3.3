type ErrorMessageType = {
    field: string
    message: string
}

export type ErrorsMessagesType = {
    errorsMessages: ErrorMessageType[]
}

export const generateErrorMessage = (field: string, message: string): ErrorsMessagesType => {
    return { errorsMessages: [{ field, message }] };
}