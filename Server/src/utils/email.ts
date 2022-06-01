import nodemailer from "nodemailer";
import env from "../config/env";

export default (to: string, token: string) => {

    const smtpTransport = nodemailer.createTransport({

      host: env.SMTP_SERVER,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      
      
  })

    const data = {
        from: env.SMTP_USER,
        to: to,
        subject: 'Welcome to Bookables',
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; min-height: 70vh; width: 100%">
          <div style="width: 60%; margin: 100px auto; border: solid 1px gray; border-radius: 10px; padding: 50px; text-align: center; height: 400px;">
            <h1 style="background-color: #a39f9f; color: white; text-align: center; width: 400px; margin:50px auto; border-radius: 10px;">Bookables</h1>
            <p style="margin-top: 70px; font-size: 1.5rem;">Welcome to Bookables!</p>
            <p style="margin-bottom: 50px;">Click the following link to verify your email address</p>
            <a style="background-color: rgb(0, 199, 0);padding: 10px; font-size: 1.3rem;text-decoration: none; color: white;" href="${env.URL}/emailConfirmation/${token}">Verify your email</a>
          </div>
        </body>
          </html>
        `
    }

    smtpTransport.sendMail(data, function(err, response) {

        if (err) {
            console.log(err)
        }
      })

     
      smtpTransport.close()
}



    
