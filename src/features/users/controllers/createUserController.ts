import { Request, Response } from "express"
import {InputUserType, OutputUserType} from "../input-output-types/user-types";

export const createUserController = async (req: Request<{}, OutputUserType, InputUserType>, res: Response<OutputUserType>) => {
    try {
        const user = await userSerice.createUser(req.body)
    } catch (err) {
        console.error(err)
    }
}