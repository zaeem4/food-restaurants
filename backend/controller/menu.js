const Pool = require("../config/db");

const Logger = require("../utils/logger");

const getDays = () => {
  return [...Array(31).keys()].map((i) => i + 1);
};

const get = async (req, res) => {
  try {
    const query = `
      SELECT m.*, ml.name AS meals, ml.id AS meals_id,
        
        ARRAY_AGG(DISTINCT md.day) AS day,
        ARRAY_AGG(DISTINCT u.user_name) AS restaurant,
        ARRAY_AGG(DISTINCT md.type) AS type

        FROM menus m 

        LEFT JOIN menusmeals mm on m.id = mm.menu_id
        LEFT JOIN meals ml on mm.meal_id = ml.id
        
        LEFT JOIN menusdates md on m.id = md.menu_id

        LEFT JOIN restaurants r on m.restaurant_id = r.id
        LEFT JOIN users u on r.user_id = u.id

      group by m.id, ml.id;
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
        days: getDays(),
        type: ["big", "small"],
      });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, meals_id, restaurant_id, day, type } = req.body;

    if (day.length <= 0) {
      return res.json({
        success: false,
        error: `Select dates of month`,
      });
    }

    if (meals_id.length <= 0) {
      return res.json({
        success: false,
        error: `Select meals also`,
      });
    }

    for (const i of day) {
      const dayCount = await Pool.query(
        `select * from menusdates where day = '${i}' ;`
      );

      const count = dayCount.rows.length;

      if (count >= 2) {
        return res.json({
          success: false,
          error: `Only 2 menu can be add on ${i} date`,
        });
      } else if (count == 1) {
        if (type == dayCount.rows[0].type) {
          return res.json({
            success: false,
            error: `menu of type ${type} is already created on ${i} date`,
          });
        }
      }
    }

    const query = `
      INSERT INTO menus (name, description, restaurant_id)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const values = [name, description, restaurant_id];
    const result = await Pool.query(query, values);

    if (result.rows.length > 0) {
      for (const i of day) {
        const menuId = result.rows[0].id;
        const menusDatesInsertQuery = `
            INSERT INTO menusdates (menu_id, day, type)
            VALUES ($1, $2, $3);
            `;
        const menusDatesValues = [menuId, i, type];

        await Pool.query(menusDatesInsertQuery, menusDatesValues);
      }
      for (const i of meals_id) {
        const menuId = result.rows[0].id;
        const menusMealsInsertQuery = `
            INSERT INTO menusmeals (menu_id, meal_id)
            VALUES ($1, $2);
            `;
        const menusMealsValues = [menuId, i];

        await Pool.query(menusMealsInsertQuery, menusMealsValues);
      }
      return res.json({ success: true });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(create) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  get,
  create,
};
