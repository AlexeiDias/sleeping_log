import nodemailer from 'nodemailer';
console.log("🧪 Deploy version: FINAL-FIX");


console.log("🔍 SMTP ENV:", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "✅ present" : "❌ missing",
});


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
  try {
    const result = await transporter.sendMail({
      from: `"Baby Logger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", result);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error; // Make sure this surfaces in the API route
  }
}

