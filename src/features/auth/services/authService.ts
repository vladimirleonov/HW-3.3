import {UserDbType} from "../../../db/db-types/user-db-types"
import {bearerAdapter} from "../../../common/adapters/bearer.adapter"
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
import {JwtPayloadCustomType} from "../../../common/types/jwtPayloadType";


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
                isConfirmed: false
            }
        }

        await userMongoRepository.create(newUser)

        // try {

        nodemailerAdapter.sendEmail(
            newUser.email,
            registrationEmailTemplate(newUser.emailConfirmation.confirmationCode!)
        )
        //.catch((err) => console.error(err))

        // } catch(err) {
        //     console.log('Send email error', err)
        // }

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

        const jwtPayload: JwtPayloadCustomType = {
            userId: user._id.toString()
        }

        const accessToken: string = bearerAdapter.generateToken(jwtPayload, '10s')
        const refreshToken: string = bearerAdapter.generateToken(jwtPayload, '20s')

        return {
            status: ResultStatus.Success,
            data: {
                accessToken,
                refreshToken
            }
        }
    },
    async refreshToken(token: string): Promise<Result<RefreshTokenOutputServiceType | null>> {
        const decoded: JwtPayload = bearerAdapter.verifyToken(token) as JwtPayload
        if (!decoded || !decoded.userId) {
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

        const user: UserDbType | null = await userMongoRepository.findUserById(decoded.userId)
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'No user found'}],
                data: null
            }
        }

        const jwtPayload: JwtPayloadCustomType = {
            userId: user._id.toString()
        }

        await revokedTokenRepository.create(token, decoded.userId)

        const accessToken: string = bearerAdapter.generateToken(jwtPayload, '10s')
        const refreshToken: string = bearerAdapter.generateToken(jwtPayload, '20s')

        return {
            status: ResultStatus.Success,
            data: {
                accessToken,
                refreshToken
            }
        }
    },
    async logout (token: string): Promise<Result> {
        const decoded: JwtPayload = bearerAdapter.verifyToken(token) as JwtPayload
        if (!decoded || !decoded.userId) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Invalid refresh token'}],
                data: null
            }
        }

        // const isRevoked: RevokedTokenDbType | null = await revokedTokenRepository.findByToken(token)
        // if(isRevoked) {
        //     return {
        //         status: ResultStatus.Unauthorized,
        //         extensions: [{field: 'refreshToken', message: 'Refresh token has expired'}],
        //         data: null
        //     }
        // }

        await revokedTokenRepository.create(token, decoded.userId)

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async checkAccessToken(authHeader: string): Promise<Result<JwtPayloadCustomType | null>> {
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

        let payload: JwtPayloadCustomType
        try {
            payload = bearerAdapter.verifyToken(token) as JwtPayloadCustomType
            if (!payload || !payload.userId) {
                return {
                    status: ResultStatus.Unauthorized,
                    extensions: [{field: 'accessToken', message: 'Invalid access token'}],
                    data: null
                }
            }
        } catch (err) {
            console.error('', err)
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
    }
}