// import {Request, Response} from 'express'
// import {IdParamInputType} from '../../../common/input-output-types/common-types'
// import {HTTP_CODES} from '../../../settings'
// import {BlogBodyInputType, BlogOutputType} from "../input-output-types/blog-types"
// import {blogService} from "../services/blogService"
// import {Result, ResultStatus} from "../../../common/types/result"
//
// export const updateBlogController = async (req: Request<IdParamInputType, BlogOutputType, BlogBodyInputType>, res: Response<BlogOutputType>) => {
//     try {
//         const result: Result<boolean> = await blogService.updateBlog(req.params.id, req.body)
//
//         if (result.status === ResultStatus.NotFound) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         }
//
//         res.status(HTTP_CODES.NO_CONTENT).send()
//     } catch (err) {
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }