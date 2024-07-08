import mongoose from "mongoose"
import {ApiAccessLog} from "../db-types/api-access-log-db-types"

const apiAccessLogSchema = new mongoose.Schema<ApiAccessLog>(
    {
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
    }, { _id: false }
)

export const ApiAccessLogModel = mongoose.model<ApiAccessLog>('ApiAccessLog', apiAccessLogSchema)