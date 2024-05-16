import {Request, Response, NextFunction} from 'express';
import {HTTP_CODES} from "../settings";

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.message === 'Blog not found') {
        res.status(404).send({ error: 'Blog not found' });
    } else {
        const errorMessage = 'Internal Server Error'; // Сообщение по умолчанию
        const errorStatus = HTTP_CODES.INTERNAL_SERVER_ERROR; // Статус по умолчанию

        res.status(errorStatus).send({
            error: errorMessage
        });
    }
};