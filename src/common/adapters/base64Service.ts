export const base64Service = {
    encodeToBase64 (data: string) {
        return Buffer.from(data).toString('base64')
    },
    decodeFromBase64 (data: string) {
        return Buffer.from(data, 'base64')
    }
}