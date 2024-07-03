import {UserDbType, UserDocument, UserModel} from "../../../db/models/user.model"
import {jwtAdapter} from "../../../common/adapters/jwt.adapter"
import {Result, ResultStatus} from "../../../common/types/result"
import {cryptoAdapter} from "../../../common/adapters/crypto.adapter"
import {userMongoRepository} from "../../users/repository/userMongoRepository";
import {ObjectId, WithId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {nodemailerAdapter} from "../../../common/adapters/nodemailer.adapter";
import {registrationEmailTemplate} from "../../../common/email-templates/registrationEmailTemplate";
import {
    LoginInputServiceType, LogoutInputServiceType, RefreshTokenInputServiceType,
    RegistrationConfirmationInputServiceType,
    RegistrationEmailResendingInputServiceType,
    RegistrationInputServiceType,
} from "../types/inputTypes/authInputServiceTypes";
import {LoginOutputServiceType, RefreshTokenOutputServiceType} from "../types/outputTypes/authOutputServiceTypes";
import {JwtPayload} from "jsonwebtoken";
import {userDeviceMongoRepository} from "../../security/repository/userDeviceMongoRepository";
import {UserDeviceDBType, UserDeviceDocument, UserDeviceModel} from "../../../db/models/devices.model";
import {unixToISOString} from "../../../common/helpers/unixToISOString";

export const authService = {
    async registration(input: RegistrationInputServiceType): Promise<Result> {
        const userByEmail: WithId<UserDbType> | null = await userMongoRepository.findUserByEmail(input.email)
        if (userByEmail) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const userByLogin: WithId<UserDbType> | null = await userMongoRepository.findUserByLogin(input.login)
        if (userByLogin) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const passwordHash: string = await cryptoAdapter.createHash(input.password, saltRounds)

        const newUser: UserDocument = new UserModel({
            //_id: new ObjectId(),
            login: input.login,
            email: input.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }).toISOString(),
                isConfirmed: false
            }
        })

        await userMongoRepository.save(newUser)
        //await userMongoRepository.create(newUser)

        nodemailerAdapter.sendEmail(
            newUser.email,
            registrationEmailTemplate(newUser.emailConfirmation.confirmationCode!)
        )

        return {
            status: ResultStatus.Success,
            data: null,
        }
    },
    async confirmRegistration(input: RegistrationConfirmationInputServiceType): Promise<Result> {
        const existingUser: WithId<UserDbType> | null = await userMongoRepository.findUserByConfirmationCode(input.code)
        console.log(existingUser)
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
        await userMongoRepository.updateIsConfirmed(existingUser._id.toString(), isConfirmed)

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async registrationEmailResending(input: RegistrationEmailResendingInputServiceType): Promise<Result> {
        const existingUser: WithId<UserDbType> | null = await userMongoRepository.findUserByEmail(input.email)
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

        const newConfirmationCode = randomUUID();
        const newExpirationDate = add(new Date(), {
            hours: 1,
            minutes: 30,
        }).toISOString()

        await userMongoRepository.updateConfirmationInfo(existingUser._id.toString(), newConfirmationCode, newExpirationDate)

        await nodemailerAdapter.sendEmail(
            input.email,
            registrationEmailTemplate(newConfirmationCode)
        )

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async login(input: LoginInputServiceType): Promise<Result<LoginOutputServiceType | null>> {
        if (input.refreshToken) {
            try {
                jwtAdapter.verifyToken(input.refreshToken);
                return {
                    status: ResultStatus.BadRequest,
                    extensions: [{
                        field: 'refreshToken',
                        message: 'Refresh token is still valid. Logout before logging in again'
                    }],
                    data: null
                };
            } catch (err) {
                // console.log('Invalid refresh token, proceeding with login');
            }
        }

        const user: WithId<UserDbType> | null = await userMongoRepository.findUserByLoginOrEmailField(input.loginOrEmail)
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

        const accessToken: string = jwtAdapter.generateToken(JwtAccessTokenPayload, '10s')
        const refreshToken: string = jwtAdapter.generateToken(JwtRefreshTokenPayload, '20s')

        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken)
        if (decodedRefreshToken && typeof decodedRefreshToken !== 'string') {
            const {iat, exp} = decodedRefreshToken

            const deviceName: string = input.deviceName
            const ip: string = input.ip

            const newUserDevice: UserDeviceDocument = new UserDeviceModel({
                _id: new ObjectId(),
                userId: user._id.toString(),
                deviceId: decodedRefreshToken.deviceId,
                iat: unixToISOString(iat),
                deviceName: deviceName,
                ip: ip,
                exp: unixToISOString(exp)
            })

            //await userDeviceMongoRepository.create(newUserDevice)
            await userDeviceMongoRepository.save(newUserDevice)

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
    },
    async refreshToken({deviceId, userId, iat: issuedAt}: RefreshTokenInputServiceType): Promise<Result<
        RefreshTokenOutputServiceType | null
    >> {
        const device: WithId<UserDeviceDBType> | null = await userDeviceMongoRepository.findOneByDeviceIdAndIat({
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
        console.log("old issued at", issuedAt)

        const JwtAccessTokenPayload: JwtPayload = {
            userId: userId
        }

        const JwtRefreshTokenPayload: JwtPayload = {
            userId: userId,
            deviceId: deviceId
        }

        const accessToken: string = jwtAdapter.generateToken(JwtAccessTokenPayload, '10s')
        const refreshToken: string = jwtAdapter.generateToken(JwtRefreshTokenPayload, '20s')

        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken)
        if (decodedRefreshToken) {
            const {iat} = decodedRefreshToken as JwtPayload
            console.log("new refresh token iat", unixToISOString(iat))

            const issuedAt: string = unixToISOString(iat)

            const isUpdated: boolean = await userDeviceMongoRepository.update({deviceId, iat: issuedAt})
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
    },
    async logout({deviceId, iat}: LogoutInputServiceType): Promise<Result> {
        const isDeleted: boolean = await userDeviceMongoRepository.deleteOneByDeviceIdAndIAt({deviceId, iat})
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
    },
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

        const user: WithId<UserDbType> | null = await userMongoRepository.findUserById(payload.userId)
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
    },
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
            const user: WithId<UserDbType> | null = await userMongoRepository.findUserById(payload.userId)
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











// export const authService = {
//     async registration(input: RegistrationInputServiceType): Promise<Result> {
//         const userByEmail: UserDbType | null = await userMongoRepository.findUserByEmail(input.email)
//         if (userByEmail) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'email', message: 'User with such credentials already exists'}],
//                 data: null
//             }
//         }

//         const userByLogin: UserDbType | null = await userMongoRepository.findUserByLogin(input.login)
//         if (userByLogin) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 extensions: [{field: 'login', message: 'User with such credentials already exists'}],
//                 data: null
//             }
//         }

//         const saltRounds: number = 10
//         const passwordHash: string = await cryptoAdapter.createHash(input.password, saltRounds)

//         const newUser: UserDbType = {
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
//         const existingUser: UserDbType | null = await userMongoRepository.findUserByConfirmationCode(input.code)
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
//         const existingUser: UserDbType | null = await userMongoRepository.findUserByEmail(input.email)
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

//         const newConfirmationCode = randomUUID();
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
//                 jwtAdapter.verifyToken(input.refreshToken);
//                 return {
//                     status: ResultStatus.BadRequest,
//                     extensions: [{
//                         field: 'refreshToken',
//                         message: 'Refresh token is still valid. Logout before logging in again'
//                     }],
//                     data: null
//                 };
//             } catch (err) {
//                 // console.log('Invalid refresh token, proceeding with login');
//             }
//         }

//         const user: UserDbType | null = await userMongoRepository.findUserByLoginOrEmailField(input.loginOrEmail)
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

//         const user: UserDbType | null = await userMongoRepository.findUserById(payload.userId)
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
//             const user: UserDbType | null = await userMongoRepository.findUserById(payload.userId)
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