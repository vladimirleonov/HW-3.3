export const registrationEmailTemplate = (confirmationCode: string): string => {
    return `
            <p>Thanks for your registration</p>
            <p>To finish the registration please follow the link bellow 
                <a href="http://localhost:3001/${confirmationCode}">ссылке</a>
            </p>
        `
}