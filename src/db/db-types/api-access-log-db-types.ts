import {WithId} from "mongodb"
import {HydratedDocument} from "mongoose"

export type ApiAccessLogDbType = WithId<{
    ip: string,
    URL: string,
    date: Date
}>

export type ApiAccessLogDocument = HydratedDocument<ApiAccessLogDbType>