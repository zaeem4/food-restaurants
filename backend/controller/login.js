const BCRYPT = require("bcrypt");

const JWT = require("jsonwebtoken");

const Pool = require("../config/db");
const transport = require("../config/mailer");

const Logger = require("../utils/logger");

const verify = async (req, res) => {
  try {
    const { email, password } = req.body;
    let userDetails = await Pool.query(
      `select * from users where email = '${email}';`
    );
    if (userDetails.rows.length > 0) {
      userDetails = userDetails.rows[0];
      validPassword = await BCRYPT.compare(password, userDetails.password);

      if (validPassword) {
        const token = JWT.sign(
          {
            email: userDetails.email,
            role: userDetails.role,
            id: userDetails.id,
          },
          process.env.TOKEN_KEY,
          {
            algorithm: "HS256",
            expiresIn: "18h",
          }
        );
        const permissions = await Pool.query(
          `select * from permissions where role = '${userDetails.role}';`
        );

        if (userDetails.role === "restaurant") {
          let role = await Pool.query(
            `select * from restaurants where user_id = '${userDetails.id}';`
          );
          role = role.rows[0];
          userDetails["role_id"] = role.id;
        } else if (userDetails.role === "company") {
          let role = await Pool.query(
            `select * from companies where user_id = '${userDetails.id}';`
          );
          role = role.rows[0];
          userDetails["role_id"] = role.id;
          userDetails["restaurant_owner"] = role.restaurant_owner;
          userDetails["type"] = role.type;
        } else if (userDetails.role === "kitchen") {
          let role = await Pool.query(
            `select * from kitchens where user_id = '${userDetails.id}';`
          );
          role = role.rows[0];
          userDetails["role_id"] = role.id;
          userDetails["restaurant_id"] = role.restaurant_id;
        }

        userDetails.permissions =
          permissions.rows.length > 0 ? permissions.rows[0].scope : {};

        delete userDetails["password"];
        delete userDetails["created_at"];
        delete userDetails["updated_at"];

        return res.json({
          success: true,
          token: token,
          userDetails: userDetails,
        });
      } else {
        return res.json({
          success: false,
          error: "Enter passwrd is incorrect",
        });
      }
    }
    return res.json({
      success: false,
      error: "User with the provided email does not exist",
    });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    let userDetails = await Pool.query(
      `select * from users where email = '${email}';`
    );
    if (userDetails.rows.length > 0) {
      const pin = Math.floor(1000 + Math.random() * 9000);
      const userId = userDetails.rows[0].id;

      const isInserted = await Pool.query(
        `INSERT INTO resetpin (user_id, pin) VALUES('${userId}', '${pin}') ON CONFLICT (user_id) DO UPDATE SET pin ='${pin}' RETURNING user_id;`
      );

      if (isInserted.rows.length > 0) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: userDetails.rows[0].email,
          subject: "Forget Password Pin",
          html: `<b>Your pin to reset password is ${pin}</b>`,
        };

        const isSend = await transport.sendMail(mailOptions);

        return res.json({ success: true });
      }
    }
    return res.json({
      success: false,
      error: "User with the provided email does not exist.",
    });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const verifyPin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let userDetails = await Pool.query(
      `select * from users where email = '${email}';`
    );
    if (userDetails.rows.length > 0) {
      const count = await Pool.query(
        `select * from resetpin WHERE pin='${otp}' and user_id = '${userDetails.rows[0].id}' ;`
      );

      if (count.rows.length > 0) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false, error: "pin invalid" });
      }
    }
    return res.json({
      success: false,
      error: "User with the provided email does not exist.",
    });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, repeatPassword, email, otp } = req.body;

    if (newPassword === repeatPassword) {
      let userDetails = await Pool.query(
        `select * from users where email = '${email}';`
      );
      if (userDetails.rows.length > 0) {
        const count = await Pool.query(
          `select * from resetpin WHERE pin='${otp}' and user_id = '${userDetails.rows[0].id}' ;`
        );

        if (count.rows.length > 0) {
          const hashPassword = await BCRYPT.hash(newPassword, 10);
          const upDated = await Pool.query(
            `UPDATE users set password = '${hashPassword}' where id = '${userDetails.rows[0].id}' returning id;`
          );
          if (upDated.rows.length > 0) {
            await Pool.query(
              `DELETE from resetpin where user_id = '${userDetails.rows[0].id}';`
            );
            return res.json({ success: true });
          }
        } else {
          return res.json({ success: false, error: "pin invalid" });
        }
      }
    } else {
      return res.json({ success: false, error: "password not matched" });
    }

    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  verify,
  verifyPin,
  verifyEmail,
  resetPassword,
};
