export type TerminateAllOtherDeviceSessionsInputServiceType = {
    deviceId: string
    userId: string
}

export type TerminateDeviceSessionInputServiceType = {
    deviceId: string
    userId: string
}

export type CheckRateLimitInputServiceType = {
    ip: string
    originUrl: string
}
