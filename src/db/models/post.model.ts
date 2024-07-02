import {ObjectId} from "mongodb"
import mongoose, {HydratedDocument} from "mongoose"

export type PostDbType = {
    //_id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}

export type PostDocument = HydratedDocument<PostDbType>

const isValidISOString = (value: string) => {
    const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoRegex.test(value);
};

const postSchema = new mongoose.Schema<PostDbType>(
    {
        title: {
            type: String,
            maxlength: 30,
            required: true
        },
        shortDescription: {
            type: String,
            maxlength: 100,
            required: true
        },
        content: {
            type: String,
            maxlength: 1000,
            required: true
        },
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        blogName: {
            type: String,
            maxlength: 1000,
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

export const PostModel = mongoose.model('Post', postSchema)