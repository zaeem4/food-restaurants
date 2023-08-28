const BCRYPT = require("bcrypt");

const Pool = require("../config/db");

const Logger = require("../utils/logger");

const currentTime = () => {
  return new Date().toUTCString();
};

function generateRandomPassword() {
  const length = 10;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const get = async (req, res) => {
  try {
    const query = `
        SELECT k.*, u.*
        FROM kitchens k
        JOIN users u ON k.user_id = u.id;
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, kitchens: result.rows });
    }

    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 employee(get) | ${error}`);
    return res.json({ success: false, error: error });
  }
};
const create = async (req, res) => {
  try {
    const { user_name, email, description, restaurant_id } = req.body;

    const randomPassword = generateRandomPassword();
    const hashPassword = await BCRYPT.hash(randomPassword, 10);

    const user = await Pool.query(
      `INSERT INTO users (id,user_name,email,password,role,created_at,updated_at) VALUES (DEFAULT, '${user_name}', '${email}', '${hashPassword}', 'kitchen', $1, $1) RETURNING id`,
      [currentTime()]
    );

    if (user.rows.length > 0) {
      const query = `
        INSERT INTO kitchens (user_id,description, restaurant_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
      const values = [user.rows[0].id, description, restaurant_id];
      const result = await Pool.query(query, values);

      if (result.rows.length > 0) {
        return res.json({ success: true, password: randomPassword });
      }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 employee(create) | ${error}`);
    return res.json({ success: false, error: error });
  }
};

module.exports = {
  get,
  create,
};
