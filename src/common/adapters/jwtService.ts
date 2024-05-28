const jwtService = {
    generateToken (password: string) {
        jwt.sign(password, process.env.JWT_SECRET, {})
    }
}