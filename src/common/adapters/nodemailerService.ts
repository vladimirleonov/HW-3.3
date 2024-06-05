import nodemailer, {Transporter} from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {SETTINGS} from "../../settings";

export const nodemailerService = {
    async sendEmail(recipient: string, emailTemplate: string) {
        let transporter: Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
            host: SETTINGS.EMAIL.HOST,
            port: parseInt(SETTINGS.EMAIL.PORT, 10),
            secure: SETTINGS.EMAIL.PORT === '465', // true for 465, false for other ports
            auth: {
                user: SETTINGS.EMAIL.USER,
                pass: SETTINGS.EMAIL.PASSWORD,
            }
        });

        let info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
            from: SETTINGS.EMAIL.USER,
            to: recipient,
            subject: 'Test Email',
            html: emailTemplate
        });

        console.log('Message sent: %s', info.messageId);
    }
}