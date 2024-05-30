export enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest',
    InternalError = 'InternalError'
}

export type Result<T = null> = {
    status: ResultStatus,
    errorMessage?: string,
    extensions?: [{field: string, message: string}],
    data: T
}