const transporter = require("../config/emailTransporter");
const nodemailer = require("nodemailer");

const sendAccountActivation = async (email, token) => {
  const info = await transporter.sendMail({
    from: "My App <info@my-app.com>",
    to: email,
    subject: "Account Activation",
    html: `
    <div>
      <b>Please Click below link to activate your account</b>
      <a href="http://localhost:3000/api/1.0/user/token=${token}">Activate</a>
      <b>Token is ${token}</b>
    </div>`,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("url: " + nodemailer.getTestMessageUrl(info));
  }
};
module.exports = {
  sendAccountActivation,
};
