import mongoose, {HydratedDocument} from "mongoose"

export type ApiAccessLogDbType = {
    ip: string,
    URL: string,
    date: Date
}

export type ApiAccessLogDocument = HydratedDocument<ApiAccessLogDbType>

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