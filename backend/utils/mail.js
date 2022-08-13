const nodemailer = require("nodemailer");

exports.generateOTP = (otp_length = 6) => {
  let OTP = "";

  for (let i = 0; i <= 5; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
};

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "073125883e4955",
      pass: "1d38d5e6aea917",
    },
  });
