import mongoose, {HydratedDocument} from "mongoose";

export type UserDeviceDBType = {
    //_id: ObjectId
    userId: string
    deviceId: string
    iat: string
    deviceName: string
    ip: string
    exp: string
}

export type UserDeviceDocument = HydratedDocument<UserDeviceDBType>

const userDeviceSchema = new mongoose.Schema({
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

export const UserDeviceModel = mongoose.model('UserDevice', userDeviceSchema)