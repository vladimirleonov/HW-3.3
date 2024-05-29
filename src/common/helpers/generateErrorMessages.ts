import {ErrorsMessagesType} from "../types/errorsMessages";

export const generateErrorsMessages = (field: string, message: string): ErrorsMessagesType => {
    return { errorsMessages: [{ field, message }] };
}