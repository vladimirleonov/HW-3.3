import {Request} from "express";

export const getDeviceName = (req: Request): string => {
    return req.headers['user-agent'] || 'unknown'
}