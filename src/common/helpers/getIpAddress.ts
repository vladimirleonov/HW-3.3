import { Request } from "express";

export const getIpAddress = (req: Request): string => {
    let ipAddress: string | undefined = undefined;

    // for proxy devices (load balancer ...)
    const forwardedForHeader = req.headers['x-forwarded-for'];
    // string ip(s)
    if (typeof forwardedForHeader === 'string') {
        const ips: string[] = forwardedForHeader.split(',').map((ip) => ip.trim());
        ipAddress = ips[0];
    // array ip(s)
    } else if (Array.isArray(forwardedForHeader)) {
        ipAddress = forwardedForHeader[0];
    }

    if (!ipAddress) {
        ipAddress = req.socket.remoteAddress;
    }

    // delete prefix ::ffff: for IPv4
    if (ipAddress && ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '');
    }

    return ipAddress || '';
}