import mongoose from "mongoose";
import {UserDeviceDBType} from "../db-types/user-devices-db-types";

const userDeviceSchema = new mongoose.Schema<UserDeviceDBType>({
    userId: {
        type: String,
        maxLength: 50,
        required: true
    },
    deviceId: {
        type: String,
        maxLength: 50,
        required: true
    },
    iat: {
        type: String,
        maxLength: 50,
        required: true
    },
    deviceName: {
        type: String,
        maxLength: 100,
        required: true
    },
    ip: {
        type: String,
        maxLength: 20,
        required: true
    },
    exp: {
        type: String,
        maxLength: 50,
        required: true
    },
})

export const UserDeviceModel = mongoose.model<UserDeviceDBType>('UserDevice', userDeviceSchema)