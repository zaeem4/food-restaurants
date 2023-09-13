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

const getAllCompaniesWithUsers = async (req, res) => {
  try {
    const query = `
      SELECT c.*, u.*, ru.user_name as restaurant_user_name
      FROM companies c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN restaurants r on c.restaurant_owner = r.id
      LEFT JOIN users ru on r.user_id = ru.id
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      const restaurants = await Pool.query(
        "select r.*, u.user_name from restaurants r LEFT JOIN users u on r.user_id = u.id;"
      );
      return res.json({
        success: true,
        companies: result.rows,
        restaurants: restaurants.rows,
        type: ["big", "small"],
        shifts: ["first-shift", "second-shift", "third-shift"],
      });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 company(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const {
      user_name,
      email,
      address,
      city,
      tax_number,
      phone,
      owner,
      shifts,
      restaurant_owner,
      type,
    } = req.body;

    const randomPassword = generateRandomPassword();
    const hashPassword = await BCRYPT.hash(randomPassword, 10);

    const user = await Pool.query(
      `INSERT INTO users (id,user_name,email,password,role,created_at,updated_at) VALUES (DEFAULT, '${user_name}', '${email}', '${hashPassword}', 'company', $1, $1) RETURNING id`,
      [currentTime()]
    );

    if (user.rows.length > 0) {
      const query = `
        INSERT INTO companies (user_id, address, city, tax_number, phone, owner, shifts,restaurant_owner,type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
    `;
      const values = [
        user.rows[0].id,
        address,
        city,
        tax_number,
        phone,
        owner,
        shifts,
        restaurant_owner,
        type,
      ];
      const result = await Pool.query(query, values);

      if (result.rows.length > 0) {
        return res.json({ success: true, password: randomPassword });
      }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 company(create) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCompaniesWithUsers,
  create,
};
