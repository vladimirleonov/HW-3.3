type DeleteInputType = {
    deviceId: string,
    userId: string
}

type ByDeviceIdAndIAtInputType = {
    deviceId: string,
    iat: string
}

export type UpdateInputType = ByDeviceIdAndIAtInputType

export type deleteAllOtherByDeviceIdAndUserIdInputType = DeleteInputType

export type deleteOneByDeviceIdAndUserIdInputType = DeleteInputType

export type deleteOneByDeviceIdAndIAtInputType = ByDeviceIdAndIAtInputType

export type findOneByDeviceIdAndIatInputType = ByDeviceIdAndIAtInputType

