// import {Request, Response} from 'express'
// import {PostBodyInputType, PostOutputType} from "../input-output-types/post-types"
// import {HTTP_CODES} from "../../../settings"
// import {postService} from "../services/postService"
// import {postMongoQueryRepository} from "../repository/postMongoQueryRepository"
// import {Result} from "../../../common/types/result"
//
// export const createPostController = async (req: Request<{}, PostOutputType, PostBodyInputType>, res: Response<PostOutputType | string>) => {
//     try {
//         const result: Result<string | null> = await postService.createPost(req.body)
//
//         const post: PostOutputType | null = await postMongoQueryRepository.findForOutputById(result.data!)
//         if (!post) {
//             // error if just created post not found
//             res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('something went wrong');
//             return;
//         }
//
//         res.status(HTTP_CODES.CREATED).send(post!)
//     } catch (err) {
//         console.error(err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }