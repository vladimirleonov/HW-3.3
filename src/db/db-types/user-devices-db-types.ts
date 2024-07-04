import {WithId} from "mongodb";

export type UserDeviceDBType = WithId<{
    userId: string
    deviceId: string
    iat: string
    deviceName: string
    ip: string
    exp: string
}>