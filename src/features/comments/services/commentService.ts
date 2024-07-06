import {postMongoRepository} from "../../posts/repository/postMongoRepository"
import {Result, ResultStatus} from "../../../common/types/result"
import {CommentModel} from "../../../db/models/comment.model"
import {ObjectId, WithId} from "mongodb"
import {CommentBodyInputType} from "../input-output-types/comment-types"
import {userMongoRepository} from "../../users/repository/userMongoRepository"
import {commentMongoRepository} from "../repository/commentMongoRepository"
import {CommentDbType, CommentDocument, LikeStatus, LikeType} from "../../../db/db-types/comment-db-types";
import {PostDbType} from "../../../db/db-types/post-db-types";
import {UserDbType} from "../../../db/db-types/user-db-types";
import {LikeBodyInputServiceType} from "../input-output-types/comment-like-types";

export const commentService = {
    async createComment(postId: string, input: CommentBodyInputType, userId: string): Promise<Result<string | null>> {
        const post: WithId<PostDbType> | null = await postMongoRepository.findById(postId)
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'post', message: "Post with specified postId doesn't exist"}],
                data: null
            }
        }

        const user: UserDbType | null = await userMongoRepository.findUserById(userId)
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'user', message: "User doesn't exist"}],
                data: null
            }
        }

        const newComment: CommentDocument = new CommentModel({
            _id: new ObjectId(),
            postId: new ObjectId(postId),
            content: input.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        })

        const createdComment: CommentDocument = await commentMongoRepository.save(newComment)
        //const createdId: string = await commentMongoRepository.create(newComment)

        return {
            status: ResultStatus.Success,
            data: createdComment._id.toString()
        }
    },
    async updateComment(id: string, input: CommentBodyInputType, userId: string): Promise<Result> {
        const comment: WithId<CommentDbType> | null = await commentMongoRepository.findById(id)
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'comment', message: "Comment with id doesn't exist"}],
                data: null
            }
        }

        if (userId !== comment.commentatorInfo.userId) {
            return {
                status: ResultStatus.Forbidden,
                extensions: [{field: 'user', message: "Comment doesn't belongs to user"}],
                data: null
            }
        }

        const isUpdated: boolean = await commentMongoRepository.update(id, input)
        //? check !isUpdated
        if (!isUpdated) {
            return {
                status: ResultStatus.InternalError,
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async updateLikeStatus(input: LikeBodyInputServiceType):Promise<Result> {
        console.log("input", input)
        // input {
        //     commentId: '6687d769b7dec08d74da8d4a',
        //         likeStatus: 'Like',
        //         userId: '6687d6ab73799f48aa5d87ba'
        // }
        const comment: CommentDocument | null = await commentMongoRepository.findById(input.commentId)
        console.log("comment", comment)
        // postId: new ObjectId('6687d6feb7dec08d74da8d33'),
        //         content: 'contentcontentcontentcontent3',
        //         commentatorInfo: { userId: '6687d6ab73799f48aa5d87ba', userLogin: 'test123' },
        //         likesCount: 0,
        //         dislikesCount: 0,
        //         createdAt: '2024-07-05T11:22:17.393Z',
        //         likes: [],
        //         __v: 0
        // }
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'commentId', message: `Comment with ${input.commentId} does not exist`}],
                data: null
            }
        }

        const userLike: LikeType | undefined = comment.likes.find(like => like.authorId === input.userId)

        if (!userLike) {
            console.log("!userLike")
            const likeToAdd: LikeType = {
                createdAt: new Date().toISOString(),
                status: input.likeStatus as LikeStatus,
                authorId: input.userId,
            }
            comment.likes.push(likeToAdd)
            comment.likesCount = Number(comment.likesCount) + 1
        // LikeStatus the same
        } else if (userLike && userLike.status === input.likeStatus) {
            console.log("nothing change")
            // Like
        } else if (userLike && input.likeStatus === LikeStatus.Like) {
            console.log("Like")
            userLike.status = LikeStatus.Like
            comment.likesCount = Number(comment.likesCount) + 1
        // Dislike
        } else if (userLike && input.likeStatus === LikeStatus.Dislike) {
            console.log("Dislike")
            userLike.status = LikeStatus.Dislike
            comment.likesCount = Number(comment.likesCount) - 1
        }
        await commentMongoRepository.save(comment)

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async deleteComment(id: string, userId: string): Promise<Result> {
        const comment: WithId<CommentDbType> | null = await commentMongoRepository.findById(id)
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'userId', message: "Comment doesn't exist"}],
                data: null
            }
        }

        if (comment.commentatorInfo.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                extensions: [{field: 'userId', message: "Comment doesn't belongs to user"}],
                data: null
            }
        }

        const isDeleted: boolean = await commentMongoRepository.deleteOne(id)
        if (!isDeleted) {
            return {
                status: ResultStatus.InternalError,
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
}






// export const commentService = {
//     async createComment(postId: string, input: CommentBodyInputType, userId: string): Promise<Result<string | null>> {
//         const post: PostDbType | null = await postMongoRepository.findById(postId)
//         if (!post) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'post', message: "Post with specified postId doesn't exist"}],
//                 data: null
//             }
//         }

//         const user: UserDbType | null = await userMongoRepository.findUserById(userId)
//         if (!user) {
//             return {
//                 status: ResultStatus.Unauthorized,
//                 extensions: [{field: 'user', message: "User doesn't exist"}],
//                 data: null
//             }
//         }

//         const newComment: CommentDbType = {
//             _id: new ObjectId(),
//             postId: new ObjectId(postId),
//             content: input.content,
//             commentatorInfo: {
//                 userId: userId,
//                 userLogin: user.login
//             },
//             createdAt: new Date().toISOString()
//         }

//         const createdId: string = await commentMongoRepository.create(newComment)

//         return {
//             status: ResultStatus.Success,
//             data: createdId
//         }
//     },
//     async updateComment(id: string, input: CommentBodyInputType, userId: string): Promise<Result> {
//         const comment: CommentDbType | null = await commentMongoRepository.findById(id)
//         if (!comment) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'comment', message: "Comment with id doesn't exist"}],
//                 data: null
//             }
//         }

//         if (userId !== comment.commentatorInfo.userId) {
//             return {
//                 status: ResultStatus.Forbidden,
//                 extensions: [{field: 'user', message: "Comment doesn't belongs to user"}],
//                 data: null
//             }
//         }

//         const isUpdated: boolean = await commentMongoRepository.update(id, input)
//         //? check !isUpdated
//         if (!isUpdated) {
//             return {
//                 status: ResultStatus.InternalError,
//                 data: null
//             }
//         }
//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     },
//     async deleteComment(id: string, userId: string): Promise<Result> {
//         const comment: CommentDbType | null = await commentMongoRepository.findById(id)
//         if (!comment) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'userId', message: "Comment doesn't exist"}],
//                 data: null
//             }
//         }

//         if (comment.commentatorInfo.userId !== userId) {
//             return {
//                 status: ResultStatus.Forbidden,
//                 extensions: [{field: 'userId', message: "Comment doesn't belongs to user"}],
//                 data: null
//             }
//         }

//         const isDeleted: boolean = await commentMongoRepository.deleteOne(id)
//         if (!isDeleted) {
//             return {
//                 status: ResultStatus.InternalError,
//                 data: null
//             }
//         }

//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     }
// }