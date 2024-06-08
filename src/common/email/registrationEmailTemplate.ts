export const registrationEmailTemplate = (confirmationCode: string): string => {
    return `
         <h1>Thanks for your registration</h1>
         <p>To finish registration please follow the link below:
             <a href='http://localhost:3001/${confirmationCode}'>complete registration</a>
         </p>
        `
}

