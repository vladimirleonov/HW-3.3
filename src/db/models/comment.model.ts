import mongoose from "mongoose"
import {CommentatorInfo, Comment, LikeStatus, Like} from "../db-types/comment-db-types";

const isValidISOString = (value: string) => {
    const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoRegex.test(value);
};

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>(
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

const likeSchema = new mongoose.Schema<Like>({
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

const commentSchema = new mongoose.Schema<Comment>(
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
    console.log("in getUserLikeStatusByUserId", userId)
    const userLike = this.likes.find((like: Like): boolean => like.authorId === userId)
    console.log("userLike", userLike)
    return userLike ? userLike.status : 'None'
}

export const CommentModel = mongoose.model<Comment>('Comment', commentSchema)