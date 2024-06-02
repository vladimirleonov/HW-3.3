import {
    CommentOutputType
} from "../../src/features/comments/input-output-types/comment-types";
import {req} from "./req";
import {HTTP_CODES, SETTINGS} from "../../src/settings";

export const createComment = async (postId: string, accessToken: string): Promise<CommentOutputType> => {
    const res = await req
        .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
        .set('authorization', `Bearer ${accessToken}`)
        .send({
            content: `contentcontentcontentcontentcontentcontent`
        })
        .expect(HTTP_CODES.CREATED)

    return res.body
}

export const createComments = async (count: number = 2, postId: string, accessToken: string): Promise<CommentOutputType[]> => {
    const comments: CommentOutputType[] = []

    for (let i = 0; i < count; i++) {
        const res =  await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Bearer ${accessToken}`)
            .send({
                content: `contentcontentcontentcontentcontentcontent${i}`
            })
            .expect(HTTP_CODES.CREATED)

        comments.push(res.body)
    }

    return comments
}