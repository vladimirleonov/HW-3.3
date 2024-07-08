// import {Request, Response} from "express";
// import {commentService} from "../services/commentService";
// import {LikeBodyInputControllerType} from "../input-output-types/comment-like-types";
// import {HTTP_CODES} from "../../../settings";
// import {CommentIdParamInputType} from "../input-output-types/comment-types";
// import {Result, ResultStatus} from "../../../common/types/result";
//
// export const updateLikeStatusController = async (req: Request<CommentIdParamInputType, {}, LikeBodyInputControllerType>, res: Response) => {
//     try {
//         if (!req.user || !req.user.userId) {
//             res.status(HTTP_CODES.UNAUTHORIZED).send()
//             return
//         }
//
//         const dto = {
//             commentId: req.params.commentId,
//             likeStatus: req.body.likeStatus,
//             userId: req.user.userId
//         }
//
//         const result: Result = await commentService.updateLikeStatus(dto)
//         if (result.status === ResultStatus.NotFound) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         }
//
//         res.status(HTTP_CODES.NO_CONTENT).send()
//     } catch(err) {
//         console.error("updateLikeStatusController", err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }