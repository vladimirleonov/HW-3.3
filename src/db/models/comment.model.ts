import mongoose from "mongoose"
import {CommentatorInfoType, CommentDbType, LikeStatus, LikeType} from "../db-types/comment-db-types";

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
}, { _id: false })

const likeSchema = new mongoose.Schema<LikeType>({
    createdAt: {
        type: String,
        validate: {
            validator: isValidISOString,
            message: "createdAt must be a valid ISO string",
        },
        required: true
    },
    status: {
        type: String,
        enum: LikeStatus,
        required: true
    },
    authorId: {
        type: String,
        required: true
    }
}, { _id: false })

const commentSchema = new mongoose.Schema<CommentDbType>(
    {
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
        likes: {
            type: [likeSchema],
            required: true
        },
        likesCount: {
            type: Number,
            default: 0,
            min: 0,
            required: true
        },
        dislikesCount: {
            type: Number,
            default: 0,
            required: true
        },
        createdAt: {
            type: String,
            validate: {
                validator: isValidISOString,
                message: "createdAt must be a valid ISO string",
            },
            required: true
        }
    }
)

commentSchema.methods.getUserLikeStatusByUserId = function (userId: string): LikeStatus {
    const userLike = this.likes.find((like: LikeType): boolean => like.authorId === userId)
    return userLike ? userLike.likeStatus : null
}

export const CommentModel = mongoose.model<CommentDbType>('Comment', commentSchema)