import {postMongoRepository} from "../../posts/repository/postMongoRepository";
import {PostDbType} from "../../../db/db-types/post-db-types";
import {Result, ResultStatus} from "../../../common/types/result-type";
import {CommentDbType} from "../../../db/db-types/comment-db-types";
import {ObjectId} from "mongodb";
import {CommentInputType} from "../input-output-types/comment-types";
import {UserDbType} from "../../../db/db-types/user-db-types";
import {userMongoRepository} from "../../users/repository/userMongoRepository";
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository";
import {commentMongoRepository} from "../repository/commentMongoRepository";

export const commentService = {
    async createComment (postId: string, input: CommentInputType, userId: string): Promise<Result<string | null>> {
        const post: PostDbType | null = await postMongoRepository.findById(postId)
        if(!post) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{ field: 'post', message: "Post with specified postId doesn't exist"}],
                data: null
            }
        }

        const user: UserDbType | null = await userMongoRepository.findUserById(userId)
        //? Unauthorized
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{ field: 'user', message: "User doesn't exist"}],
                data: null
            }
        }

        const newComment: CommentDbType = {
            _id: new ObjectId(),
            content: input.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }

        const createdId: string = await commentMongoRepository.create(newComment)
        console.log(createdId)

        return {
            status: ResultStatus.Success,
            data: createdId
        }
    }
}