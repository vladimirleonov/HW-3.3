import {
    LoginInputType,
    RegisterUserBodyInputType,
    RegistrationConfirmationUserBodyInputType,
    registrationEmailResendingUserBodyInputType
} from "../input-output-types/auth-types"
import {UserDbType} from "../../../db/db-types/user-db-types"
import {bearerService} from "../../../common/adapters/bearerService"
import {Result, ResultStatus} from "../../../common/types/result-type"
import {cryptoService} from "../../../common/adapters/cryptoService"
import {JwtPayloadType} from "../../../common/types/jwtPayloadType"
import {userMongoRepository} from "../../users/repository/userMongoRepository";
import {ObjectId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {nodemailerService} from "../../../common/adapters/nodemailerService";
import {registrationEmailTemplate} from "../../../common/email/registrationEmailTemplate";
import {DeepPartial} from "../../../common/types/deepPartial";

export const authService = {
    async registrationUser(input: RegisterUserBodyInputType): Promise<Result> {
        const existingUser: UserDbType | null = await userMongoRepository.findUserByLoginAndEmail(input.login, input.email)
        if (existingUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login or email', message: 'User with such credentials already exists'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const passwordHash: string = await cryptoService.createHash(input.password, saltRounds)

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

        try {
            await nodemailerService.sendEmail(
                newUser.email,
                registrationEmailTemplate(newUser.emailConfirmation.confirmationCode!)
            )
        } catch(err) {
            console.log('Send email error', err)
        }

        return {
            status: ResultStatus.Success,
            data: null,
            //data: newUser,
        }
    },
    async confirmRegistration(input: RegistrationConfirmationUserBodyInputType): Promise<Result<null | boolean>> {
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

        const userToUpdate: DeepPartial<UserDbType> = {
            emailConfirmation: {
                isConfirmed: true
            }
        }

        await userMongoRepository.update(existingUser._id.toString(), userToUpdate)

        return {
            status: ResultStatus.Success,
            data: true
        }
    },
    async registrationEmailResending(input: registrationEmailResendingUserBodyInputType): Promise<Result> {
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

        const userToUpdate: DeepPartial<UserDbType> = {
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }).toISOString()
            }
        }

        await nodemailerService.sendEmail(
            input.email,
            registrationEmailTemplate(userToUpdate.emailConfirmation?.confirmationCode!)
        )

        await userMongoRepository.update(existingUser._id.toString(), userToUpdate)

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async login(input: LoginInputType): Promise<Result<string | null>> {
        const user: UserDbType | null = await userMongoRepository.findUserByLoginOrEmailField(input.loginOrEmail)
        if (!user || !(await cryptoService.compare(input.password, user.password))) {
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

        const jwtPayload: JwtPayloadType = {
            userId: user._id.toString()
        }

        const token: string = bearerService.generateToken(jwtPayload)

        return {
            status: ResultStatus.Success,
            data: token
        }
    }
}