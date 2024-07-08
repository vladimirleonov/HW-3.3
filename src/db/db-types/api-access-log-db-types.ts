import {HydratedDocument} from "mongoose"

// export type ApiAccessLogDbType = WithId<{
//     ip: string,
//     URL: string,
//     date: Date
// }>

export class ApiAccessLog {
    constructor(
        public ip: string,
        public URL: string,
        public date: Date
    ) {}
}

export type ApiAccessLogDocument = HydratedDocument<ApiAccessLog>