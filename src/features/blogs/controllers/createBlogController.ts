import {Request, Response} from 'express'
import {InputBlogType, OutputBlogType} from '../../../input-output-types/blog-types'
import {HTTP_CODES} from '../../../settings';
import {blogMongoRepository} from "../repository/blogMongoRepository";
import {ObjectId} from "mongodb";

export const createBlogController = async (req: Request<{}, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    try {
        const createdInfo = await blogMongoRepository.create(req.body);
        if (createdInfo.error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send();
            return
        }

        const foundInfo = await blogMongoRepository.findForOutputById(new ObjectId(createdInfo.id))
        if (!foundInfo?.blog) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.CREATED).send(foundInfo.blog);
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}