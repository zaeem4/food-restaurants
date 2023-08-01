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

const create = async (req, res) => {
  try {
    const { user_name, email, address, city, tax_number, phone, owner } =
      req.body;
    const randomPassword = generateRandomPassword();
    const hashPassword = await BCRYPT.hash(randomPassword, 10);

    const user = await Pool.query(
      `INSERT INTO users (id,user_name,email,password,role,created_at,updated_at) VALUES (DEFAULT, '${user_name}', '${email}', '${hashPassword}', 'restaurant', $1, $1) RETURNING id`,
      [currentTime()]
    );

    if (user.rows.length > 0) {
      const query =
        "INSERT INTO restaurants (id, user_id, address, city, tax_number, phone, owner) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id";
      const values = [user.rows[0].id, address, city, tax_number, phone, owner];

      const restaurant = await Pool.query(query, values);

      if (restaurant.rows.length > 0) {
        return res.json({ success: true, password: randomPassword });
      }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || restaurants(create).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const getAllRestaurantsWithUsers = async (req, res) => {
  try {
    const query = `
      SELECT r.*, u.*
      FROM restaurants r
      JOIN users u ON r.user_id = u.id;
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, restaurants: result.rows });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || restaurant(getAllRestaurantsWithUsers).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};
module.exports = {
  create,
  getAllRestaurantsWithUsers,
};
