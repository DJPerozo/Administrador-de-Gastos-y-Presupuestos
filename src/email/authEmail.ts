import { transport } from "../config/nodemailler";
import colors from 'colors';

interface UserEmail {
  name: string
  email: string
  token: string
}
    
class EmailAuth{
  static confirmationEmail = async (user: UserEmail) => {
    const email = await transport.sendMail({
      from: 'CashTrackr',
      to: user.email,
      subject: 'CashTrackr - Confirma tu cuenta',
      html: `
        <p> Hola ${user.name} as creado una cuenta en CashTrackr, ya esta casi lista </p>
        <p>Visita el siguiente enlace</p>
        <ahref="#"> Confirmar Cuenta</a>     
        <p> Ingresa el codigo <b>${user.token}</b> </p>
      `
    })
    console.log(colors.green.bold('Email enviado con exito'), email.messageId)
  };


  static resetPasswordEmail = async (user: UserEmail) => {
    const email = await transport.sendMail({
      from: 'CashTrackr',
      to: user.email,
      subject: 'CashTrackr - Reestablese tu Password',
      html: `
        <p> Hola ${user.name} as Solicitado Reestableser tu password </p>
        <p>Visita el siguiente enlace</p>
        <ahref="#"> Reestableser Password</a>     
        <p> Ingresa el codigo <b>${user.token}</b> </p>
      `
    })
    console.log(colors.green.bold('Email enviado con exito'), email.messageId)


  };



}

export default EmailAuth;