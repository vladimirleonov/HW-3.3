enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest',
}

export type Result <T = null> = {
    status: ResultStatus,
    errorMessage?: string,
    extensions?: [{field: 'id', message: ''}],
    date: T
}