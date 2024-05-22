import { Request, Response } from "express"

export const deleteUserController = async (req: Request<{}, {}, {}, {}>, res: Response) => {
    try {
        console.log("deleteUserController")
    } catch (err) {
        console.error(err)
    }
}