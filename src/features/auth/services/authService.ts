import {UserModel} from "../../../db/models/user.model"
import {jwtAdapter} from "../../../common/adapters/jwt.adapter"
import {Result, ResultStatus} from "../../../common/types/result"
import {cryptoAdapter} from "../../../common/adapters/crypto.adapter"
import {UserMongoRepository} from "../../users/repository/userMongoRepository"
import {ObjectId, WithId} from "mongodb"
import {randomUUID} from "node:crypto"
import {add} from "date-fns"
import {nodemailerAdapter} from "../../../common/adapters/nodemailer.adapter"
import {registrationEmailTemplate} from "../../../common/email-templates/registrationEmailTemplate"
import {
    LoginInputServiceType,
    LogoutInputServiceType,
    NewPasswordInputServiceType,
    RefreshTokenInputServiceType,
    RegistrationConfirmationInputServiceType,
    RegistrationEmailResendingInputServiceType,
    RegistrationInputServiceType,
    RegistrationPasswordRecoveryInputServiceType,
} from "../types/inputTypes/authInputServiceTypes"
import {LoginOutputServiceType, RefreshTokenOutputServiceType} from "../types/outputTypes/authOutputServiceTypes"
import {JwtPayload} from "jsonwebtoken"
import {UserDeviceMongoRepository} from "../../security/repository/userDeviceMongoRepository"
import {UserDeviceModel} from "../../../db/models/devices.model"
import {unixToISOString} from "../../../common/helpers/unixToISOString"
import {passwordRecoveryEmailTemplate} from "../../../common/email-templates/passwordRecoveryEmailTemplate"
import {EmailConfirmation, PasswordRecovery, User, UserDocument} from "../../../db/db-types/user-db-types"
import {UserDevice, UserDeviceDocument} from "../../../db/db-types/user-devices-db-types"

export class AuthService {
    userMongoRepository: UserMongoRepository
    userDeviceMongoRepository: UserDeviceMongoRepository
    constructor() {
        this.userMongoRepository = new UserMongoRepository()
        this.userDeviceMongoRepository = new UserDeviceMongoRepository()
    }
    // +
    async registration(input: RegistrationInputServiceType): Promise<Result> {
        const userByEmail: WithId<User> | null = await this.userMongoRepository.findUserByEmail(input.email)
        if (userByEmail) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const userByLogin: WithId<User> | null = await this.userMongoRepository.findUserByLogin(input.login)
        if (userByLogin) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const passwordHash: string = await cryptoAdapter.createHash(input.password, saltRounds)

        const userData: User = new User(
            new ObjectId(),
            input.login,
            passwordHash,
            input.email,
            new Date().toISOString(),
            new EmailConfirmation(
                randomUUID(),
                add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }).toISOString(),
                false
            ),
            new PasswordRecovery(
                '',
                ''
            )
        )

        const UserDocument: UserDocument = new UserModel(userData)

        await this.userMongoRepository.save(UserDocument)

        nodemailerAdapter.sendEmail(
            userData.email,
            registrationEmailTemplate(userData.emailConfirmation.confirmationCode!),
            'Registration Confirmation'
        )

        return {
            status: ResultStatus.Success,
            data: null,
        }
    }
    // +
    async registrationPasswordRecovery(input: RegistrationPasswordRecoveryInputServiceType): Promise<Result> {
        const existingUser: WithId<User> | null = await this.userMongoRepository.findUserByEmail(input.email)
        if (!existingUser) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{
                    field: 'email',
                    message: `User with email ${input.email} does not exist`
                }],
                data: null
            }
        }

        const recoveryCode: string = randomUUID()
        const expirationDate: string = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        const passwordRecoveryDTO: PasswordRecovery = new PasswordRecovery(
            recoveryCode,
            expirationDate
        )

        const userId: string = existingUser._id.toString()
        await this.userMongoRepository.updatePasswordRecoveryInfo(userId, passwordRecoveryDTO)

        await nodemailerAdapter.sendEmail(
            input.email,
            passwordRecoveryEmailTemplate(passwordRecoveryDTO.recoveryCode),
            'Password Recovery'
        )

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    // +
    async setNewPassword(input: NewPasswordInputServiceType): Promise<Result> {
        const user: UserDocument | null = await this.userMongoRepository.findUserByRecoveryCode(input.recoveryCode)
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'recoveryCode', message: 'Incorrect recovery code'}],
                data: null
            }
        }

        const currentDate: Date = new Date()
        const expirationDate: Date = new Date(user.passwordRecovery.expirationDate)

        if (expirationDate < currentDate) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'recoveryCode', message: 'Recovery code has expired'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const passwordHash: string = await cryptoAdapter.createHash(input.newPassword, saltRounds)

        user.password = passwordHash
        user.passwordRecovery.recoveryCode = '' // set '' after successful update
        user.passwordRecovery.expirationDate = '' // set '' after successful update
        await this.userMongoRepository.save(user)

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    // +
    async confirmRegistration(input: RegistrationConfirmationInputServiceType): Promise<Result> {
        const existingUser: WithId<User> | null = await this.userMongoRepository.findUserByConfirmationCode(input.code)
        if (!existingUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'Invalid confirmation code'}],
                data: null
            }
        }

        if (existingUser.emailConfirmation.expirationDate < (new Date()).toISOString()) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'Confirmation code has expired'}],
                data: null
            }
        }

        if (existingUser.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'User account already confirmed'}],
                data: null
            }
        }

        const isConfirmed: boolean = true
        const userId: string = existingUser._id.toString()
        await this.userMongoRepository.updateIsConfirmed(userId, isConfirmed)

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    // +
    async registrationEmailResending(input: RegistrationEmailResendingInputServiceType): Promise<Result> {
        const existingUser: WithId<User> | null = await this.userMongoRepository.findUserByEmail(input.email)
        if (!existingUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Invalid email'}],
                data: null
            }
        }

        // hw-9 error in test -> comment this code
        // if (existingUser.emailConfirmation.isConfirmed) {
        //     return {
        //         status: ResultStatus.BadRequest,
        //         extensions: [{field: 'email', message: 'Email already confirmed'}],
        //         data: null
        //     }
        // }

        const confirmationCode: string = randomUUID()
        const expirationDate: string = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        const userId: string = existingUser._id.toString()
        await this.userMongoRepository.updateEmailConfirmationInfo(userId, confirmationCode, expirationDate)

        await nodemailerAdapter.sendEmail(
            input.email,
            registrationEmailTemplate(expirationDate),
            'Registration Confirmation'
        )

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    // +
    async login(input: LoginInputServiceType): Promise<Result<LoginOutputServiceType | null>> {
        if (input.refreshToken) {
            try {
                jwtAdapter.verifyToken(input.refreshToken)
                return {
                    status: ResultStatus.BadRequest,
                    extensions: [{
                        field: 'refreshToken',
                        message: 'Refresh token is still valid. Logout before logging in again'
                    }],
                    data: null
                }
            } catch (err) {
                // console.log('Invalid refresh token, proceeding with login')
            }
        }

        const user: WithId<User> | null = await this.userMongoRepository.findUserByLoginOrEmailField(input.loginOrEmail)
        if (!user || !(await cryptoAdapter.compare(input.password, user.password))) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login or password', message: 'Wrong login or password'}],
                data: null
            }
        }

        if (!user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Email is not confirmed'}],
                data: null
            }
        }

        const JwtAccessTokenPayload: JwtPayload = {
            userId: user._id.toString()
        }

        const deviceId: string = randomUUID()

        const JwtRefreshTokenPayload: JwtPayload = {
            userId: user._id.toString(),
            deviceId: deviceId
        }

        const accessToken: string = jwtAdapter.generateToken(JwtAccessTokenPayload, '10h')
        const refreshToken: string = jwtAdapter.generateToken(JwtRefreshTokenPayload, '20h')

        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken)
        if (decodedRefreshToken && typeof decodedRefreshToken !== 'string') {
            const {iat, exp} = decodedRefreshToken

            const deviceName: string = input.deviceName
            const ip: string = input.ip

            const UserDeviceData: UserDevice = new UserDevice(
                new ObjectId(),
                user._id.toString(),
                decodedRefreshToken.deviceId,
                unixToISOString(iat),
                deviceName,
                ip,
                unixToISOString(exp)
            )

            const UserDeviceDocument: UserDeviceDocument = new UserDeviceModel(UserDeviceData)

            await this.userDeviceMongoRepository.save(UserDeviceDocument)

            return {
                status: ResultStatus.Success,
                data: {
                    accessToken,
                    refreshToken
                }
            }
        }

        return {
            status: ResultStatus.Unauthorized,
            data: null
        }
    }
    // +
    async refreshToken({deviceId, userId, iat: issuedAt}: RefreshTokenInputServiceType): Promise<Result<
        RefreshTokenOutputServiceType | null
    >> {
        const device: WithId<UserDevice> | null = await this.userDeviceMongoRepository.findOneByDeviceIdAndIat({
            deviceId,
            iat: issuedAt
        })
        if (!device) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                data: null
            }
        }

        const JwtAccessTokenPayload: JwtPayload = {
            userId: userId
        }

        const JwtRefreshTokenPayload: JwtPayload = {
            userId: userId,
            deviceId: deviceId
        }

        const accessToken: string = jwtAdapter.generateToken(JwtAccessTokenPayload, '10h')
        const refreshToken: string = jwtAdapter.generateToken(JwtRefreshTokenPayload, '20h')

        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken)
        if (decodedRefreshToken) {
            const {iat} = decodedRefreshToken as JwtPayload

            const issuedAt: string = unixToISOString(iat)

            const isUpdated: boolean = await this.userDeviceMongoRepository.update({deviceId, iat: issuedAt})
            if (!isUpdated) {
                return {
                    status: ResultStatus.Unauthorized,
                    //?
                    extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                    data: null
                }
            }

            return {
                status: ResultStatus.Success,
                data: {
                    accessToken,
                    refreshToken
                }
            }
        }
        return {
            status: ResultStatus.Unauthorized,
            data: null
        }
    }
    async logout({deviceId, iat}: LogoutInputServiceType): Promise<Result> {
        const isDeleted: boolean = await this.userDeviceMongoRepository.deleteOneByDeviceIdAndIAt({deviceId, iat})
        if (!isDeleted) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Invalid or expired refresh token'}],
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async checkAccessToken(authHeader: string): Promise<Result<JwtPayload | null>> {
        if (!authHeader.startsWith('Bearer ')) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'accessToken', message: 'Access token not provided'}],
                data: null
            }
        }

        const token: string = authHeader.split(' ')[1]
        if (!token) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'accessToken', message: 'Access token not provided'}],
                data: null
            }
        }

        let payload: JwtPayload
        try {
            payload = jwtAdapter.verifyToken(token) as JwtPayload
            if (!payload || !payload.userId) {
                return {
                    status: ResultStatus.Unauthorized,
                    extensions: [{field: 'accessToken', message: 'Invalid access token!'}],
                    data: null
                }
            }
        } catch (err) {
            console.error('verifyToken', err)
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'accessToken', message: 'Invalid access token'}],
                data: null
            }
        }

        const user: WithId<User> | null = await this.userMongoRepository.findUserById(payload.userId)
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'accessToken', message: 'User not found'}],
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            data: payload
        }
    }
    async checkRefreshToken(token: string): Promise<Result<JwtPayload | null>> {
        try {
            const payload: JwtPayload = jwtAdapter.verifyToken(token) as JwtPayload
            if (!payload || !payload.deviceId || !payload.userId) {
                return {
                    status: ResultStatus.Unauthorized,
                    extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                    data: null
                }
            }

            //? check if user exist by userId (may also check match user to deviceId)
            const user: WithId<User> | null = await this.userMongoRepository.findUserById(payload.userId)
            if (!user) {
                return {
                    status: ResultStatus.Unauthorized,
                    extensions: [{field: 'accessToken', message: 'User not found'}],
                    data: null
                }
            }

            return {
                status: ResultStatus.Success,
                data: payload
            }
        } catch (err) {
            console.error("checkRefreshToken", err)
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                data: null
            }
        }
    }
}

// export const authService = new AuthService()



// export const authService = {
//     async registration(input: RegistrationInputServiceType): Promise<Result> {
//         const userByEmail: User | null = await userMongoRepository.findUserByEmail(input.email)
//         if (userByEmail) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'email', message: 'User with such credentials already exists'}],
//                 data: null
//             }
//         }

//         const userByLogin: User | null = await userMongoRepository.findUserByLogin(input.login)
//         if (userByLogin) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'login', message: 'User with such credentials already exists'}],
//                 data: null
//             }
//         }

//         const saltRounds: number = 10
//         const passwordHash: string = await cryptoAdapter.createHash(input.password, saltRounds)

//         const newUser: User = {
//             _id: new ObjectId(),
//             login: input.login,
//             email: input.email,
//             password: passwordHash,
//             createdAt: new Date().toISOString(),
//             emailConfirmation: {
//                 confirmationCode: randomUUID(),
//                 expirationDate: add(new Date(), {
//                     hours: 1,
//                     minutes: 30,
//                 }).toISOString(),
//                 isConfirmed: true
//             }
//         }

//         await userMongoRepository.create(newUser)

//         nodemailerAdapter.sendEmail(
//             newUser.email,
//             registrationEmailTemplate(newUser.emailConfirmation.confirmationCode!)
//         )

//         return {
//             status: ResultStatus.Success,
//             data: null,
//         }
//     },
//     async confirmRegistration(input: RegistrationConfirmationInputServiceType): Promise<Result> {
//         const existingUser: User | null = await userMongoRepository.findUserByConfirmationCode(input.code)
//         if (!existingUser) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'code', message: 'Invalid confirmation code'}],
//                 data: null
//             }
//         }

//         if (existingUser.emailConfirmation.expirationDate < (new Date()).toISOString()) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'code', message: 'Confirmation code has expired'}],
//                 data: null
//             }
//         }

//         if (existingUser.emailConfirmation.isConfirmed) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'code', message: 'User account already confirmed'}],
//                 data: null
//             }
//         }

//         const isConfirmed: boolean = true
//         await userMongoRepository.updateIsConfirmed(existingUser._id.toString(), isConfirmed)

//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     },
//     async registrationEmailResending(input: RegistrationEmailResendingInputServiceType): Promise<Result> {
//         const existingUser: User | null = await userMongoRepository.findUserByEmail(input.email)
//         if (!existingUser) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'email', message: 'Invalid email'}],
//                 data: null
//             }
//         }

//         // hw-9 error in test -> comment this code
//         // if (existingUser.emailConfirmation.isConfirmed) {
//         //     return {
//         //         status: ResultStatus.BadRequest,
//         //         extensions: [{field: 'email', message: 'Email already confirmed'}],
//         //         data: null
//         //     }
//         // }

//         const newConfirmationCode = randomUUID()
//         const newExpirationDate = add(new Date(), {
//             hours: 1,
//             minutes: 30,
//         }).toISOString()

//         await userMongoRepository.updateConfirmationInfo(existingUser._id.toString(), newConfirmationCode, newExpirationDate)

//         await nodemailerAdapter.sendEmail(
//             input.email,
//             registrationEmailTemplate(newConfirmationCode)
//         )

//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     },
//     async login(input: LoginInputServiceType): Promise<Result<LoginOutputServiceType | null>> {
//         if (input.refreshToken) {
//             try {
//                 jwtAdapter.verifyToken(input.refreshToken)
//                 return {
//                     status: ResultStatus.BadRequest,
//                     extensions: [{
//                         field: 'refreshToken',
//                         message: 'Refresh token is still valid. Logout before logging in again'
//                     }],
//                     data: null
//                 }
//             } catch (err) {
//                 // console.log('Invalid refresh token, proceeding with login')
//             }
//         }

//         const user: User | null = await userMongoRepository.findUserByLoginOrEmailField(input.loginOrEmail)
//         if (!user || !(await cryptoAdapter.compare(input.password, user.password))) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'login or password', message: 'Wrong login or password'}],
//                 data: null
//             }
//         }

//         if (!user.emailConfirmation.isConfirmed) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'email', message: 'Email is not confirmed'}],
//                 data: null
//             }
//         }

//         const JwtAccessTokenPayload: JwtPayload = {
//             userId: user._id.toString()
//         }

//         const deviceId: string = randomUUID()

//         const JwtRefreshTokenPayload: JwtPayload = {
//             userId: user._id.toString(),
//             deviceId: deviceId
//         }

//         const accessToken: string = jwtAdapter.generateToken(JwtAccessTokenPayload, '10s')
//         const refreshToken: string = jwtAdapter.generateToken(JwtRefreshTokenPayload, '20s')

//         const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken)
//         if (decodedRefreshToken && typeof decodedRefreshToken !== 'string') {
//             const {iat, exp} = decodedRefreshToken

//             const deviceName: string = input.deviceName
//             const ip: string = input.ip

//             const newUserDevice: UserDeviceDBType = {
//                 _id: new ObjectId(),
//                 userId: user._id.toString(),
//                 deviceId: decodedRefreshToken.deviceId,
//                 iat: unixToISOString(iat),
//                 deviceName: deviceName,
//                 ip: ip,
//                 exp: unixToISOString(exp)
//             }

//             await userDeviceMongoRepository.create(newUserDevice)

//             return {
//                 status: ResultStatus.Success,
//                 data: {
//                     accessToken,
//                     refreshToken
//                 }
//             }
//         }

//         return {
//             status: ResultStatus.Unauthorized,
//             data: null
//         }
//     },
//     async refreshToken({deviceId, userId, iat: issuedAt}: RefreshTokenInputServiceType): Promise<Result<
//         RefreshTokenOutputServiceType | null
//     >> {
//         const device: UserDeviceDBType | null = await userDeviceMongoRepository.findOneByDeviceIdAndIat({
//             deviceId,
//             iat: issuedAt
//         })
//         if (!device) {
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
//                 data: null
//             }
//         }

//         const JwtAccessTokenPayload: JwtPayload = {
//             userId: userId
//         }

//         const JwtRefreshTokenPayload: JwtPayload = {
//             userId: userId,
//             deviceId: deviceId
//         }

//         const accessToken: string = jwtAdapter.generateToken(JwtAccessTokenPayload, '10s')
//         const refreshToken: string = jwtAdapter.generateToken(JwtRefreshTokenPayload, '20s')

//         const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken)
//         if (decodedRefreshToken) {
//             const {iat} = decodedRefreshToken as JwtPayload

//             const issuedAt: string = unixToISOString(iat)

//             const isUpdated: boolean = await userDeviceMongoRepository.update({deviceId, iat: issuedAt})
//             if (!isUpdated) {
//                 return {
//                     status: ResultStatus.Unauthorized,
//                     //?
//                     extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
//                     data: null
//                 }
//             }

//             return {
//                 status: ResultStatus.Success,
//                 data: {
//                     accessToken,
//                     refreshToken
//                 }
//             }
//         }
//         return {
//             status: ResultStatus.Unauthorized,
//             data: null
//         }
//     },
//     async logout({deviceId, iat}: LogoutInputServiceType): Promise<Result> {
//         const isDeleted: boolean = await userDeviceMongoRepository.deleteOneByDeviceIdAndIAt({deviceId, iat})
//         if (!isDeleted) {
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'refreshToken', message: 'Invalid or expired refresh token'}],
//                 data: null
//             }
//         }

//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     },
//     async checkAccessToken(authHeader: string): Promise<Result<JwtPayload | null>> {
//         if (!authHeader.startsWith('Bearer ')) {
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'accessToken', message: 'Access token not provided'}],
//                 data: null
//             }
//         }

//         const token: string = authHeader.split(' ')[1]
//         if (!token) {
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'accessToken', message: 'Access token not provided'}],
//                 data: null
//             }
//         }

//         let payload: JwtPayload
//         try {
//             payload = jwtAdapter.verifyToken(token) as JwtPayload
//             if (!payload || !payload.userId) {
//                 return {
//                     status: ResultStatus.Unauthorized,
//                     extensions: [{field: 'accessToken', message: 'Invalid access token!'}],
//                     data: null
//                 }
//             }
//         } catch (err) {
//             console.error('verifyToken', err)
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'accessToken', message: 'Invalid access token'}],
//                 data: null
//             }
//         }

//         const user: User | null = await userMongoRepository.findUserById(payload.userId)
//         if (!user) {
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'accessToken', message: 'User not found'}],
//                 data: null
//             }
//         }

//         return {
//             status: ResultStatus.Success,
//             data: payload
//         }
//     },
//     async checkRefreshToken(token: string): Promise<Result<JwtPayload | null>> {
//         try {
//             const payload: JwtPayload = jwtAdapter.verifyToken(token) as JwtPayload
//             if (!payload || !payload.deviceId || !payload.userId) {
//                 return {
//                     status: ResultStatus.Unauthorized,
//                     extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
//                     data: null
//                 }
//             }

//             //? check if user exist by userId (may also check match user to deviceId)
//             const user: User | null = await userMongoRepository.findUserById(payload.userId)
//             if (!user) {
//                 return {
//                     status: ResultStatus.Unauthorized,
//                     extensions: [{field: 'accessToken', message: 'User not found'}],
//                     data: null
//                 }
//             }

//             return {
//                 status: ResultStatus.Success,
//                 data: payload
//             }
//         } catch (err) {
//             console.error("checkRefreshToken", err)
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
//                 data: null
//             }
//         }
//     }
// }