import mongoose from "mongoose"
import {ApiAccessLogDbType} from "../db-types/api-access-log-db-types"

const apiAccessLogSchema = new mongoose.Schema<ApiAccessLogDbType>({
    ip: {
        type: String,
        maxLength: 20,
        required: true
    },
    URL: {
        type: String,
        maxLength: 50,
        required: true
    },
    date: {
        type: Date,
        maxLength: 50,
        required: true
    }
})

export const ApiAccessLogModel = mongoose.model<ApiAccessLogDbType>('ApiAccessLog', apiAccessLogSchema)