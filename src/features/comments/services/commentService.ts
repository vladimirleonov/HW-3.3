import {PostMongoRepository} from "../../posts/repository/postMongoRepository"
import {Result, ResultStatus} from "../../../common/types/result"
import {CommentModel} from "../../../db/models/comment.model"
import {ObjectId, WithId} from "mongodb"
import {CommentBodyInputType} from "../input-output-types/comment-types"
import {UserMongoRepository} from "../../users/repository/userMongoRepository"
import {CommentMongoRepository} from "../repository/commentMongoRepository"
import {Comment, CommentDocument, LikeStatus, Like} from "../../../db/db-types/comment-db-types";
import {Post} from "../../../db/db-types/post-db-types";
import {UserDocument} from "../../../db/db-types/user-db-types";
import {LikeBodyInputServiceType} from "../input-output-types/comment-like-types";

export class CommentService {
    commentMongoRepository: CommentMongoRepository
    postMongoRepository: PostMongoRepository
    userMongoRepository: UserMongoRepository
    constructor() {
        this.commentMongoRepository = new CommentMongoRepository()
        this.postMongoRepository = new PostMongoRepository()
        this.userMongoRepository = new UserMongoRepository()
    }
    async createComment(postId: string, input: CommentBodyInputType, userId: string): Promise<Result<string | null>> {
        const post: WithId<Post> | null = await this.postMongoRepository.findById(postId)
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'post', message: "Post with specified postId doesn't exist"}],
                data: null
            }
        }

        const user: UserDocument | null = await this.userMongoRepository.findUserById(userId)
        const userLogin: string = user!.login
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

        const CommentDocument: CommentDocument = new CommentModel(commentData)

        const createdComment: CommentDocument = await this.commentMongoRepository.save(CommentDocument)

        return {
            status: ResultStatus.Success,
            data: createdComment._id.toString()
        }
    }
    async updateComment(id: string, input: CommentBodyInputType, userId: string): Promise<Result> {
        const comment: CommentDocument | null = await this.commentMongoRepository.findById(id)
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

        const isUpdated: boolean = await this.commentMongoRepository.update(id, input)
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
    }
    async updateLikeStatus(input: LikeBodyInputServiceType): Promise<Result> {
        // console.log("input", input)
        // input {
        //     commentId: '6687d769b7dec08d74da8d4a',
        //         likeStatus: 'Like',
        //         userId: '6687d6ab73799f48aa5d87ba'
        // }
        const comment: CommentDocument | null = await this.commentMongoRepository.findById(input.commentId)
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
            const likeToAdd: Like = new Like(
                new Date().toISOString(),
                input.likeStatus as LikeStatus,
                input.userId
            )
            comment.likes.push(likeToAdd)
            // for input.likeStatus = LikeStatus.Like
            if (input.likeStatus === LikeStatus.Like) comment.likesCount += 1
            // for input.likeStatus = LikeStatus.Dislike
            if (input.likeStatus === LikeStatus.Dislike) comment.dislikesCount += 1

            await this.commentMongoRepository.save(comment)
            return {
                status: ResultStatus.Success,
                data: null
            }
        }
        // Existing like with same status
        if (userLike.status === input.likeStatus) {
            console.log("nothing change")
            return {
                status: ResultStatus.Success,
                data: null
            }
        }
        // Existing like with status None
        if (input.likeStatus === LikeStatus.None) {
            console.log("None")
            comment.likes = comment.likes.filter((like: Like) => like.authorId !== input.userId)
            // was dislike
            if (userLike.status === LikeStatus.Dislike) comment.dislikesCount -= 1
            // was like
            if (userLike.status === LikeStatus.Like) comment.likesCount -= 1
        }
        // Existing like with different status Like
        if (input.likeStatus === LikeStatus.Like) {
            console.log("Like")
            // was dislike
            if (userLike.status === LikeStatus.Dislike) comment.dislikesCount -= 1
            comment.likesCount += 1

            userLike.status = input.likeStatus
            userLike.createdAt = new Date().toISOString()
        }
        // Existing like with different status Dislike
        if (input.likeStatus === LikeStatus.Dislike) {
            console.log("Dislike")
            // was like
            if (userLike.status === LikeStatus.Like) comment.likesCount -= 1
            comment.dislikesCount += 1

            userLike.status = input.likeStatus
            userLike.createdAt = new Date().toISOString()
        }

        const res = await this.commentMongoRepository.save(comment)
        console.log("like-status res", res)

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async deleteComment(id: string, userId: string): Promise<Result> {
        const comment: WithId<Comment> | null = await this.commentMongoRepository.findById(id)
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

        const isDeleted: boolean = await this.commentMongoRepository.deleteOne(id)
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
//         const post: Post | null = await postMongoRepository.findById(postId)
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