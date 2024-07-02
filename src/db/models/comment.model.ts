import {ObjectId, WithId} from "mongodb"
import mongoose, {HydratedDocument} from "mongoose"

type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export type CommentDbType = {
    //_id: ObjectId,
    postId: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}

export type CommentDocument = HydratedDocument<WithId<CommentDbType>>

const isValidISOString = (value: string) => {
    const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoRegex.test(value);
};

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>(
    {
        userId: {
            type: String,
            required: true
        },
        userLogin: {
            type: String,
            maxlength: 300,
            required: true
        }
    }
)

const commentSchema = new mongoose.Schema<CommentDbType>(
    {
        // _id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true
        // },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            maxlength: 300,
            required: true
        },
        content: {
            type: String,
            maxlength: 1000,
            required: true
        },
        commentatorInfo: {
            type: commentatorInfoSchema,
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
    }
)

export const CommentModel = mongoose.model<CommentDbType>('Comment', commentSchema)