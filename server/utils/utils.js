const nodemailer = require("nodemailer");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const User = require("../Models/user");
console.log(User);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendConfirmationMail = async (email, id) => {
  let mailOptions = {
    from: "Your Doctor Chatbot " + process.env.EMAIL,
    to: email,
    subject: "Confirmation Email",
    html: getEmailDesign(id),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent successfully");
    }
  });
};

const getEmailDesign = (id) => {
  return `<div style="background-color: #f4f4f4; padding: 20px;"><p style="font-size: 18px; margin-bottom: 20px;">Click the button below to Confirm:</p><a href="${
    process.env.BASE_URL
  }:${
    process.env.PORT
  }/auth/${id.toString()}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Confirm</a></div>`;
};

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);



module.exports = { sendConfirmationMail, openai };
