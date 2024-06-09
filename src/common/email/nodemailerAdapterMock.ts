import {nodemailerAdapter} from "../adapters/nodemailer.adapter";

export const nodemailerAdapterMock: typeof nodemailerAdapter = {
    async sendEmail(recipient: string, emailTemplate: string): Promise<boolean> {
        return true
    }
}