import {postMongoRepository} from "../../posts/repository/postMongoRepository"
import {Result, ResultStatus} from "../../../common/types/result"
import {CommentModel} from "../../../db/models/comment.model"
import {ObjectId, WithId} from "mongodb"
import {CommentBodyInputType} from "../input-output-types/comment-types"
import {userMongoRepository} from "../../users/repository/userMongoRepository"
import {commentMongoRepository} from "../repository/commentMongoRepository"
import {Comment, CommentDocument, LikeStatus, Like, CommentatorInfo} from "../../../db/db-types/comment-db-types";
import {PostDbType} from "../../../db/db-types/post-db-types";
import {UserDocument} from "../../../db/db-types/user-db-types";
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

        const user: UserDocument | null = await userMongoRepository.findUserById(userId)
        const userLogin = user!.login
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'user', message: "User doesn't exist"}],
                data: null
            }
        }

        const commentData: Comment = new Comment(
            new ObjectId(),
            new ObjectId(postId),
            input.content,
            {
                userId,
                userLogin
            },
            [],
            0,
            0,
            new Date().toISOString()
        )

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

        return {
            status: ResultStatus.Success,
            data: createdComment._id.toString()
        }
    },
    async updateComment(id: string, input: CommentBodyInputType, userId: string): Promise<Result> {
        const comment: CommentDocument | null = await commentMongoRepository.findById(id)
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
    async updateLikeStatus(input: LikeBodyInputServiceType): Promise<Result> {
        // console.log("input", input)
        // input {
        //     commentId: '6687d769b7dec08d74da8d4a',
        //         likeStatus: 'Like',
        //         userId: '6687d6ab73799f48aa5d87ba'
        // }
        const comment: CommentDocument | null = await commentMongoRepository.findById(input.commentId)
        // console.log("comment", comment)
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

        // get use like
        const userLike: Like | undefined = comment.likes.find(like => like.authorId === input.userId)

        // add like to comment likes
        if (!userLike) {
            console.log("!userLike")
            // for input.likeStatus = None
            if (input.likeStatus === LikeStatus.None) {
                return {
                    status: ResultStatus.Success,
                    data: null
                }
            }
            // input.likeStatus = (LikeStatus.Like || LikeStatus.Dislike)
            const likeToAdd: Like = {
                createdAt: new Date().toISOString(),
                status: input.likeStatus as LikeStatus,
                authorId: input.userId,
            }
            comment.likes.push(likeToAdd)
            // for input.likeStatus = LikeStatus.Like
            if (input.likeStatus === LikeStatus.Like) {
                console.log("!userLike && Like")
                comment.likesCount += 1
            // for input.likeStatus = LikeStatus.Dislike
            } else if (input.likeStatus === LikeStatus.Dislike) {
                console.log("!userLike && Dislike")
                comment.dislikesCount += 1
            }

        // LikeStatus the same
        } else if (userLike && userLike.status === input.likeStatus) {
            console.log("nothing change")
            return {
                status: ResultStatus.Success,
                data: null
            }
        // None
        } else if (userLike && input.likeStatus === LikeStatus.None) {
            console.log("None")
            comment.likes = comment.likes.filter((like: Like) => like.authorId !== input.userId)
            // was dislike
            if (userLike.status === LikeStatus.Dislike) {
                console.log("was dislike")
                comment.dislikesCount -= 1
            // was like
            } else if (userLike.status === LikeStatus.Like) {
                console.log("was like")
                comment.likesCount -= 1
            }
        // Like
        } else if (userLike && input.likeStatus === LikeStatus.Like) {
            console.log("Like")
            // was dislike
            if (userLike.status === LikeStatus.Dislike) {
                console.log("was dislike")
                comment.dislikesCount -= 1
            }
            comment.likesCount += 1

            userLike.status = input.likeStatus
            userLike.createdAt = new Date().toISOString()
        // Dislike
        } else if (userLike && input.likeStatus === LikeStatus.Dislike) {
            console.log("Dislike")
            // was like
            if (userLike.status === LikeStatus.Like) {
                console.log("was like")
                console.log("before comment.likesCount", comment.likesCount)
                comment.likesCount -= 1
                console.log("after comment.likesCount", comment.likesCount)
            }
            comment.dislikesCount += 1

            userLike.status = input.likeStatus
            userLike.createdAt = new Date().toISOString()
        }
        const res = await commentMongoRepository.save(comment)
        console.log("like-status res", res)

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async deleteComment(id: string, userId: string): Promise<Result> {
        const comment: WithId<Comment> | null = await commentMongoRepository.findById(id)
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