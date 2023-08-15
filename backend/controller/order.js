const Pool = require("../config/db");

const Logger = require("../utils/logger");

const create = async (req, res) => {
  try {
    const { name, status, company_id, restaurant_id, menus } = req.body;

    const query = `
        INSERT INTO Orders (name, status, company_id, restaurant_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;
    const values = [name, status.toLowerCase(), company_id, restaurant_id];
    const orderResult = await Pool.query(query, values);

    if (orderResult.rows.length > 0) {
      const orderId = orderResult.rows[0].id;
      const menusArray = menus.split(",").map((menuId) => parseInt(menuId));

      for (const menuId of menusArray) {
        const ordersMenusInsertQuery = `
            INSERT INTO OrdersMenus (order_id, menu_id)
            VALUES ($1, $2);
            `;
        const ordersMenusValues = [orderId, menuId];

        await Pool.query(ordersMenusInsertQuery, ordersMenusValues);
      }
      const insertQuery = `
        INSERT INTO invoices (name, restaurant_id)
        VALUES ($1, $2)
        RETURNING id;
        `;

      const values = [`invoice of ${restaurant_id}`, restaurant_id];
      const invoiceResult = await Pool.query(insertQuery, values);
      if (invoiceResult.rows.length > 0) {
        return res.json({ success: true });
      }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || order(create).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const getOrdersWithMenusAndIngredients = async (req, res) => {
  try {
    const query = `
        SELECT
            o.company_id, o.restaurant_id,
            o.id AS order_id, o.created_at, o.updated_at,
            o.status, o.name,
            array_agg(DISTINCT om.menu_id) AS menus,
            array_agg(DISTINCT i.name) AS ingredient_names
        FROM Orders o
        JOIN OrdersMenus om ON o.id = om.order_id
        JOIN menus m ON om.menu_id = m.id
        JOIN MealsIngredients mi ON m.meal_id = mi.meal_id
        JOIN ingredients i ON mi.ingredient_id = i.id
        GROUP BY o.id;
    `;
    const result = await Pool.query(query);

    if (result.rows) {
      return res.json({ success: true, orders: result.rows });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || order(getOrdersWithMenusAndIngredients).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const getInvoices = async (req, res) => {
  try {
    const query = `
        SELECT * FROM invoices;
    `;

    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, invoices: result.rows });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.error("Error getting invoices:", error);
    console.log(`400 || order(getInvoices).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

module.exports = {
  create,
  getInvoices,
  getOrdersWithMenusAndIngredients,
};
