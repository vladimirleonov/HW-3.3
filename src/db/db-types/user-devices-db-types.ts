import {ObjectId} from "mongodb"
import {HydratedDocument} from "mongoose"

// export type UserDeviceDBType = WithId<{
//     userId: string
//     deviceId: string
//     iat: string
//     deviceName: string
//     ip: string
//     exp: string
// }>

export class UserDevice {
    constructor(
        public _id: ObjectId,
        public userId: string,
        public deviceId: string,
        public iat: string,
        public deviceName: string,
        public ip: string,
        public exp: string
    ) {}
}

export type UserDeviceDocument = HydratedDocument<UserDevice>