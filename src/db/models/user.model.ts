import mongoose from "mongoose"
import {EmailConfirmation, PasswordRecovery, User} from "../db-types/user-db-types";

const isValidISOString = (value: string) => {
    const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoRegex.test(value);
};

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmation>({
    confirmationCode: {
        type: String,
        maxlength: 40,
        required: true
    },
    expirationDate: {
        type: String,
        validate: {
            validator: isValidISOString,
            message: "expirationDate must be a valid ISO string",
        },
        required: true
    },
    isConfirmed: {
        type: Boolean,
        required: true
    }
}, { _id: false })

const passwordRecoverySchema = new mongoose.Schema<PasswordRecovery>({
    recoveryCode: {
        type: String,
        maxlength: 40
    },
    expirationDate: {
        type: String,
        // validate: {
        //     validator: isValidISOString,
        //     message: "expirationDate must be a valid ISO string",
        // }
    }
}, { _id: false })

const userSchema = new mongoose.Schema<User>({
    login: {
        type: String,
        minlength: 3,
        maxlength: 10,
        match: /^[a-zA-Z0-9_-]*$/,
        required: true
    },
    password: {
        type: String,
        minlength: 1,
        maxlength: 200,
        required: true
    },
    email: {
        type: String,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        required: true
    },
    createdAt: {
        type: String,
        validate: {
            validator: isValidISOString,
            message: "createdAt must be a valid ISO string",
        },
        required: true
    },
    emailConfirmation: {
        type: emailConfirmationSchema,
        required: true
    },
    passwordRecovery: {
        type: passwordRecoverySchema
    },
})

export const UserModel = mongoose.model<User>('User', userSchema)