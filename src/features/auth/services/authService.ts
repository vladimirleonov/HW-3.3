import {LoginInputType, RegisterUserBodyInputType} from "../input-output-types/auth-types"
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
import {registrationEmailTemplate} from "../../../common/email-templates/registrationEmailTemplate";

export const authService = {
    async registrationUser(input: RegisterUserBodyInputType): Promise<Result<null | UserDbType>> {
        const user: UserDbType | null = await userMongoRepository.findUserByLoginAndEmail(input.login, input.email)
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login or password', message: 'Wrong login or password'}],
                data: null
            }
        }

        const passwordHash: string = await cryptoService.createHash(input.password, 10)

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
            const result = await nodemailerService.sendEmail(
                newUser.email,
                registrationEmailTemplate(newUser.emailConfirmation?.confirmationCode!)
            )
        } catch(err) {
            console.log('Send email error', err)
        }

        return {
            status: ResultStatus.Success,
            data: newUser,
        }
    },
    async login(input: LoginInputType): Promise<Result<string | null>> {
        const user: UserDbType | null = await userMongoRepository.findUserByLoginOrEmail(input.loginOrEmail)
        if (!user || !(await cryptoService.compare(input.password, user.password))) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login or password', message: 'Wrong login or password'}],
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