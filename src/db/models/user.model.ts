import {HydratedDocument} from "mongoose";
import mongoose from "mongoose"
import { WithId } from "mongodb";

type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
}

export type UserDbType = {
    //_id: ObjectId,
    login: string,
    password: string,
    email: string,
    createdAt: string
    emailConfirmation: EmailConfirmation,
}

export type UserDocument = HydratedDocument<WithId<UserDbType>>

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
})

const userSchema = new mongoose.Schema<UserDbType>({
    login: {
        type: String,
        minlength: 3,
        maxlength: 10,
        match: /^[a-zA-Z0-9_-]*$/,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 20,
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
    }
})

export const UserModel = mongoose.model<UserDbType>('User', userSchema)