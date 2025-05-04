import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"Baby Logger" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
