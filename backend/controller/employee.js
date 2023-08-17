const Pool = require("../config/db");

const Logger = require("../utils/logger");

const get = async (req, res) => {
  try {
    const query = `SELECT * FROM employees;`;
    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, employees: result.rows });
    }

    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 employee(get) | ${error}`);
    return res.json({ success: false, error: error });
  }
};
const create = async (req, res) => {
  try {
    const { name, company_id } = req.body;
    const query = `
        INSERT INTO employees (name, company_id)
        VALUES ($1, $2)
        RETURNING id;
    `;
    const values = [name, company_id];
    const result = await Pool.query(query, values);

    if (result.rows.length > 0) {
      return res.json({ success: true });
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
