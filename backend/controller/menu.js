const Pool = require("../config/db");

const Logger = require("../utils/logger");

const get = async (req, res) => {
  try {
    const query = "SELECT * FROM menus";
    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, menus: result.rows });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(get) | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, meal_id, restaurant_id } = req.body;
    const query = `
        INSERT INTO menus (name, description, meal_id, restaurant_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;
    const values = [name, description, meal_id, restaurant_id];
    const result = await Pool.query(query, values);

    if (result.rows.length > 0) {
      return res.json({ success: true });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(create) | ${error}`);
    return res.json({ success: false, error: error });
  }
};

module.exports = {
  get,
  create,
};
