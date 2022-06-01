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
            <body style="margin: 0; padding: 0;background-color: #000000;min-height:70vh;width:100%;">
              <p>Welcome to  Bookables!</p>
              <p>Click the following link to verify your email address</p>
              <a href="${env.URL}/emailConfirmation/${token}">Verify your email</a>
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



    
