export const encodeToBase64 = (data: string): string => {
    return Buffer.from(data).toString('base64')
}

export const decodeFromBase64 = (data: string): Buffer => {
    return Buffer.from(data, 'base64')
}