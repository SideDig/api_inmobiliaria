import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  if (!accessToken.token) {
    throw new Error('No se pudo obtener el access token.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
    tls: {
      rejectUnauthorized: false, // Opcional: ignorar errores de certificado autofirmado
    },
  });

  return transporter;
};

export default async function sendBudgetEmail(toEmail, budgetDetails) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: toEmail,
      subject: 'Detalles de tu Presupuesto',
      html: `Aquí están los detalles de tu presupuesto:\n\n${budgetDetails}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente a:', toEmail);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo.');
  }
}
