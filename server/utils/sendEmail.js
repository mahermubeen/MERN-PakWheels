const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
	  secure: false,
      auth: {
        user: "bc6679605341ee",
        pass: "8392ac2dd80240",
      },
    });

    await transporter.sendMail({
      from: "smtp.mailtrap.io",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
