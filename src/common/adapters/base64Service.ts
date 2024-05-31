export const base64Service = {
    encodeToBase64 (data: string): string {
        return Buffer.from(data).toString('base64')
    },
    decodeFromBase64 (data: string): Buffer {
        return Buffer.from(data, 'base64')
    }
}