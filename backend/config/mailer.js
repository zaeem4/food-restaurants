const nodemailer = require("nodemailer");
const Logger = require("../utils/logger");

try {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f638c512ac3561",
      pass: "23073c9cd481bd",
    },
  });

//   transport.verify((err) => {
//     // console.log(err)
//     if (err) {
//       console.log("Error occured while connecting to node mailer");
//     } else {
//       console.log("connection created with node mailer successfully");
//     }
//   });
  module.exports = transport;
} catch (error) {
  console.log(`400 || pool || ${JSON.stringify(error)}`);
}
