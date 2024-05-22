import { Request, Response } from "express"

export const createUserController = async (req: Request<{}, {}, {}, {}>, res: Response) => {
    try {
        console.log("createUserController")
    } catch (err) {
        console.error(err)
    }
}