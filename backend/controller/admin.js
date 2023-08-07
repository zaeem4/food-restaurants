const BCRYPT = require("bcrypt");

const Pool = require("../config/db");
const Logger = require("../utils/logger");

const currentTime = () => {
  return new Date().toUTCString();
};

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashPassword = await BCRYPT.hash(password, 10);

    const user = await Pool.query(
      `INSERT INTO users (id,user_name,email,password,role,created_at,updated_at) VALUES (DEFAULT, '${userName}', '${email}', '${hashPassword}', 'admin', $1, $1) RETURNING id`,
      [currentTime()]
    );

    if (user.rows.length > 0) {
      return res.json({ success: true });
    }
    return res.json({ success: false });
  } catch (error) {
    console.log(`400 || admin(register).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const role = async (req, res) => {
  try {
    const access = {
      dashboard: true,
      restaurants: true,
      meals: true,
      invoices: true,
      companies: true,
      menus: true,
      orders: false,
      employees: false,
      reports: false,
    };
    const permissions = await Pool.query(
      `INSERT INTO permissions (id,role,scope,created_at,updated_at) VALUES (DEFAULT, 'restaurant', 
      '${JSON.stringify(access)}', $1, $1) RETURNING id`,
      [currentTime()]
    );

    if (permissions.rows.length > 0) {
      return res.json({ success: true });
    }

    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || admin(register).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const getTotalCounts = async (req, res) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM restaurants) AS restaurant_count,
        (SELECT COUNT(*) FROM companies) AS company_count,
        (SELECT MAX(created_at) FROM restaurants) AS last_restaurant_created,
        (SELECT MAX(created_at) FROM companies) AS last_company_created;
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, totalCount: result.rows[0] });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || admin(getTotalCounts).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

module.exports = { register, role, getTotalCounts };
