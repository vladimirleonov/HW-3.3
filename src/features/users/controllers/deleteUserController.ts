import { Request, Response } from "express"
import {HTTP_CODES} from "../../../settings";
import {userService} from "../services/userService";
import {IdParamInputType} from "../../../common/input-output-types/common-types";

export const deleteUserController = async (req: Request<IdParamInputType>, res: Response) => {
    try {
        const isDeleted = await userService.deleteUser(req.params.id)

        if (!isDeleted) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}