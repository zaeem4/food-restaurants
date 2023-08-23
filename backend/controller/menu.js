const Pool = require("../config/db");

const Logger = require("../utils/logger");

const get = async (req, res) => {
  try {
    const query = `
      SELECT m.*, u.user_name as restaurant, ml.name as meal 
      FROM menus m 
      LEFT JOIN restaurants r on m.restaurant_id = r.id
      LEFT JOIN meals ml on m.meal_id = ml.id
      LEFT JOIN users u on r.user_id = u.id;
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      const meals = await Pool.query(`select * from meals`);
      const restaurants = await Pool.query(
        "select r.*, u.user_name from restaurants r LEFT JOIN users u on r.user_id = u.id;"
      );

      return res.json({
        success: true,
        menus: result.rows,
        meals: meals.rows,
        restaurants: restaurants.rows,
        days: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(get) | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, meal_id, restaurant_id, day } = req.body;
    const query = `
        INSERT INTO menus (name, description, meal_id, restaurant_id, day)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    const values = [name, description, meal_id, restaurant_id, day];
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
