// import nodemailer from 'nodemailer'
// import dotenv from 'dotenv'
// dotenv.config()


<<<<<<< HEAD
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   }
// })
=======
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout:10000,
  grettingTimeout:10000,
})
>>>>>>> 935294a1ffe0e366aa2c9dec9034de342c55cb35

// const sendMail = async (to, otp) => {
//   await transporter.sendMail({
//     from: `${process.env.EMAIL_USER}`,
//     to,
//     subject: "Account verification through otp.",
//     html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
//       <h2 style="color: #075e54;">🔐 Account Verification</h2>

//       <p>Hi there,</p>

//       <p>Your one-time password (OTP) to verify your account is:</p>

//       <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
//         ${otp}
//       </h1>

//       <p><strong>This OTP is valid for the next 5 minutes.</strong> Please do not share this code with anyone.</p>

//       <p>If you didn’t request this OTP, please ignore this email.</p>

//       <p style="margin-top: 20px;">Thanks & Regards,<br/>Food app teams</p>

//       <hr style="margin: 30px 0;" />

//       <small style="color: #777;">This is an automated message. Please do not reply.</small>
//     </div>`
//   })
// }

// export default sendMail


// ye code resend wala h
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendOtpEmail - sends OTP HTML via Resend
 * returns the Resend response data (message id etc)
 */
const sendMail = async (to, otp) => {
<<<<<<< HEAD
  const html = `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
=======
  try {
  await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to,
    subject: "Account verification through otp.",
    html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
>>>>>>> 935294a1ffe0e366aa2c9dec9034de342c55cb35
      <h2 style="color: #075e54;">🔐 Account Verification</h2>
      <p>Hi there,</p>
      <p>Your one-time password (OTP) to verify your account is:</p>
      <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
        ${otp}
      </h1>
      <p><strong>This OTP is valid for the next 5 minutes.</strong> Please do not share this code with anyone.</p>
      <p>If you didn’t request this OTP, please ignore this email.</p>
      <p style="margin-top: 20px;">Thanks & Regards,<br/>Food App teams</p>
      <hr style="margin: 30px 0;" />
      <small style="color: #777;">This is an automated message. Please do not reply.</small>
<<<<<<< HEAD
    </div>`;

  const { data, error } = await resend.emails.send({
    from: "Food App <no-reply@quikcart.shop>", // use your verified domain/email
    to,
    subject: "Account verification through OTP",
    html,
  });

  if (error) {
    // resend returns errors in this field; throw for upstream handling
    throw new Error(error.message || "Failed to send OTP via Resend");
  }
  return data; // contains id e.g. { id: "uuid..." }
};

=======
    </div>`
  })
  } catch (err) {
    console.log("email send error",err.message)
  }
}
>>>>>>> 935294a1ffe0e366aa2c9dec9034de342c55cb35

export default sendMail
