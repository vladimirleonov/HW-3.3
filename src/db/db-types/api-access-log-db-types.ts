import {WithId} from "mongodb";

export type ApiAccessLogDbType = WithId<{
    ip: string,
    URL: string,
    date: Date
}>