import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

export default async function sendMail(receiverMail: string, token: string) {
    const message = {
        from: process.env.NODEMAILER_USER,
        to: receiverMail,
        subject: "Happy - Recuperação de senha",
        text: `Você recebeu este email para acessar o link de recuperação de sua senha no 
        Happy. Para recuperar sua senha, acesse o link a seguir: 
        http://192.168.100.12:3000/acesso-restrito/recuperar-senha/${token}
        Não foi você? Apenas ignore este email.
        `,
        html: `
            <h2>Recuperação de senha Happy</h2>
            <p>Você recebeu este email para acessar o link de recuperação de sua senha no 
            Happy.</p>

            <p>Para recuperar sua senha, acesse o link abaixo:</p>
            <a 
                target="_blank"  
                href="http://192.168.100.12:3000/acesso-restrito/recuperar-senha/${token}"
            >Link para recuperação de senha</a> 
            
            <p>Não foi você? Apenas ignore este email.</p>
        `
    }

    return transport.sendMail(message)
}