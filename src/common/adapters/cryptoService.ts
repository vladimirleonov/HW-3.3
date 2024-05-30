import bcrypt from "bcrypt";

export const cryptoService = {
    async createHash (password: string, saltOrRounds: string | number) {
        return bcrypt.hash(password, saltOrRounds)
    },
    async compare (password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }
}