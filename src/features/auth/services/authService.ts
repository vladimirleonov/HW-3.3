import {UserDbType} from "../../../db/db-types/user-db-types"
import {jwtAdapter} from "../../../common/adapters/jwt.adapter"
import {Result, ResultStatus} from "../../../common/types/result"
import {cryptoAdapter} from "../../../common/adapters/crypto.adapter"
import {userMongoRepository} from "../../users/repository/userMongoRepository";
import {ObjectId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {nodemailerAdapter} from "../../../common/adapters/nodemailer.adapter";
import {registrationEmailTemplate} from "../../../common/email-templates/registrationEmailTemplate";
import {
    LoginInputServiceType,
    RegistrationConfirmationInputServiceType,
    RegistrationEmailResendingInputServiceType,
    RegistrationInputServiceType,
} from "../types/inputTypes/authInputServiceTypes";
import {LoginOutputServiceType, RefreshTokenOutputServiceType} from "../types/outputTypes/authOutputServiceTypes";
import {JwtPayload} from "jsonwebtoken";
import {revokedTokenRepository} from "../repository/revokedTokenRepository";
import {RevokedTokenDbType} from "../../../db/db-types/refreshToken-db-types";
import {JwtAccessTokenPayloadCustomType, JwtRefreshTokenPayloadCustomType} from "../../../common/types/jwtPayloadType";
import {userDeviceMongoRepository} from "../../security/repository/userDeviceMongoRepository";
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";


export const authService = {
    async registrationUser(input: RegistrationInputServiceType): Promise<Result> {
        const userByEmail: UserDbType | null = await userMongoRepository.findUserByEmail(input.email)
        if (userByEmail) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const userByLogin: UserDbType | null = await userMongoRepository.findUserByLogin(input.login)
        if (userByLogin) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const passwordHash: string = await cryptoAdapter.createHash(input.password, saltRounds)

        const newUser: UserDbType = {
            _id: new ObjectId(),
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
                isConfirmed: true
            }
        }

        await userMongoRepository.create(newUser)

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
        const existingUser: UserDbType | null = await userMongoRepository.findUserByConfirmationCode(input.code)
        if (!existingUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'Invalid confirmation code'}],
                data: null
            }
        }

        if(existingUser.emailConfirmation.expirationDate < (new Date()).toISOString()) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'Confirmation code has expired'}],
                data: null
            }
        }

        if(existingUser.emailConfirmation.isConfirmed) {
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
        const existingUser: UserDbType | null = await userMongoRepository.findUserByEmail(input.email)
        if (!existingUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Invalid email'}],
                data: null
            }
        }

        if (existingUser.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Email already confirmed'}],
                data: null
            }
        }

        // const userToUpdate: DeepPartial<UserDbType> = {
        //     emailConfirmation: {
        //         confirmationCode: randomUUID(),
        //         expirationDate: add(new Date(), {
        //             hours: 1,
        //             minutes: 30,
        //         }).toISOString()
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
                    extensions: [{ field: 'refreshToken', message: 'Refresh token is still valid. Logout before logging in again' }],
                    data: null
                };
            } catch (err) {
                // console.log('Invalid refresh token, proceeding with login');
            }
        }

        const user: UserDbType | null = await userMongoRepository.findUserByLoginOrEmailField(input.loginOrEmail)
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

        const AccessJwtToken: JwtAccessTokenPayloadCustomType = {
            userId: user._id.toString()
        }

        const deviceId: string = randomUUID()
        console.log("deviceId authSrvice", deviceId)
        const RefreshJwtToken: JwtRefreshTokenPayloadCustomType = {
            userId: user._id.toString(),
            deviceId: deviceId
        }

        const accessToken: string = jwtAdapter.generateToken(AccessJwtToken, '10s')
        const refreshToken: string = jwtAdapter.generateToken(RefreshJwtToken, '20s')

        /////
        //user_id  device_id  iat  device_name  ip  exp
        /////

        const decodedRefreshToken: string | JwtPayload | null  = jwtAdapter.decode(refreshToken)
        console.log(decodedRefreshToken)
        if (decodedRefreshToken && typeof decodedRefreshToken !== 'string') {
            const { iat, exp } = decodedRefreshToken as { iat: number; exp: number }

            const deviceName: string = input.deviceName
            const ip: string = input.ip

            const newUserSession: UserDeviceDBType = {
                userId: user._id.toString(),
                deviceId: decodedRefreshToken.deviceId,
                iat: iat.toString(),
                deviceName: deviceName,
                ip: ip,
                exp: exp.toString()
            }

            await userDeviceMongoRepository.create(newUserSession)
        }
        /////

        return {
            status: ResultStatus.Success,
            data: {
                accessToken,
                refreshToken
            }
        }
    },
    // async refreshToken(token: string): Promise<Result<RefreshTokenOutputServiceType | null>> {
        // let payload: JwtRefreshTokenPayloadCustomType
        // try {
        //     payload = jwtAdapter.verifyToken(token) as JwtRefreshTokenPayloadCustomType
        //     if (!payload || !payload.deviceId) {
        //         return {
        //             status: ResultStatus.Unauthorized,
        //             extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
        //             data: null
        //         }
        //     }
        // } catch (err) {
        //     console.error('Token verification failed:', err)
        //     return {
        //         status: ResultStatus.Unauthorized,
        //         extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
        //         data: null
        //     }
        // }
        //
        // const isRevoked: RevokedTokenDbType | null = await revokedTokenRepository.findByToken(token)
        // if(isRevoked) {
        //     return {
        //         status: ResultStatus.Unauthorized,
        //         extensions: [{field: 'refreshToken', message: 'Refresh token has expired'}],
        //         data: null
        //     }
        // }
        //
        // const user: UserDbType | null = await userMongoRepository.findUserById(payload.userId)
        // if (!user) {
        //     return {
        //         status: ResultStatus.Unauthorized,
        //         extensions: [{field: 'refreshToken', message: 'No user found'}],
        //         data: null
        //     }
        // }
        //
        // //!!!
        // const jwtPayload: JwtAccessTokenPayloadCustomType = {
        //     userId: user._id.toString()
        // }
        //
        // await revokedTokenRepository.create(token, payload.userId)
        //
        // const accessToken: string = jwtAdapter.generateToken(jwtPayload, '10s')
        // const refreshToken: string = jwtAdapter.generateToken(jwtPayload, '20s')
        //
        // return {
        //     status: ResultStatus.Success,
        //     data: {
        //         accessToken,
        //         refreshToken
        //     }
        // }
    // },
    async logout (token: string): Promise<Result> {
        console.log(token)
        let payload: JwtPayload
        try {
            payload = jwtAdapter.verifyToken(token) as JwtPayload
            if (!payload || !payload.userId) {
                return {
                    status: ResultStatus.Unauthorized,
                    extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                    data: null
                }
            }
        } catch (err) {
            console.error('Token verification failed:', err)
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                data: null
            }
        }

        const isRevoked: RevokedTokenDbType | null = await revokedTokenRepository.findByToken(token)
        if(isRevoked) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Refresh token has expired'}],
                data: null
            }
        }

        await revokedTokenRepository.create(token, payload.userId)

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async checkAccessToken(authHeader: string): Promise<Result<JwtAccessTokenPayloadCustomType | null>> {
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

        let payload: JwtAccessTokenPayloadCustomType
        try {
            payload = jwtAdapter.verifyToken(token) as JwtAccessTokenPayloadCustomType
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

        const user: UserDbType | null = await userMongoRepository.findUserById(payload.userId)
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
    checkRefreshToken(token: string): Result<JwtPayload | null> {
        try {
            const payload: JwtPayload  = jwtAdapter.verifyToken(token) as JwtPayload
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