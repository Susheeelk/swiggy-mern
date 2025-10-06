import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,        // Gmail address
    pass: process.env.EMAIL_PASS         // App Password (2FA enabled Gmail)
  }
})

const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Food App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Account verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #075e54;">🔐 Account Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
            ${otp}
          </h1>
          <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
          <p>Thanks,<br/>Food App Team</p>
        </div>
      `
    })
    console.log("OTP email sent to", to)
  } catch (err) {
    console.log("Mail error:", err)
    // Error ko throw mat karo → route block na ho
  }
}

export default sendMail
