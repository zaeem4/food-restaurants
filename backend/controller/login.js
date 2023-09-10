const BCRYPT = require("bcrypt");

const JWT = require("jsonwebtoken");
const JWT_DECODE = require("jwt-decode");

const Pool = require("../config/db");

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
      }
    }
    return res.json({ success: false, error: "email or password invalid" });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  verify,
};
