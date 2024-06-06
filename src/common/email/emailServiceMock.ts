import {nodemailerService} from "../adapters/nodemailerService";

export const emailServiceMock: typeof nodemailerService = {
    async sendEmail(recipient: string, emailTemplate: string): Promise<boolean> {
        return true
    }
}