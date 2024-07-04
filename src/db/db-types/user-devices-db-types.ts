import {WithId} from "mongodb"
import {HydratedDocument} from "mongoose"

export type UserDeviceDBType = WithId<{
    userId: string
    deviceId: string
    iat: string
    deviceName: string
    ip: string
    exp: string
}>

export type UserDeviceDocument = HydratedDocument<UserDeviceDBType>