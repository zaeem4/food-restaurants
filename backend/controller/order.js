const Pool = require("../config/db");

const Logger = require("../utils/logger");

const create = async (req, res) => {
  try {
    const { status, company_id, restaurant_id, employee_id, meals_id } =
      req.body;

    if (meals_id.length <= 0) {
      return res.json({
        success: false,
        error: `Select meals also`,
      });
    }

    // let employee;
    // if (!employee_id || employee_id === " ") {
    //   employee = null;
    // } else {
    //   employee = employee_id;
    // }

    const query = `
        INSERT INTO orders (status, company_id, restaurant_id, employee_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;
    const values = [status.toLowerCase(), company_id, restaurant_id, employee_id];
    const orderResult = await Pool.query(query, values);

    if (orderResult.rows.length > 0) {
      const orderId = orderResult.rows[0].id;
      // const menusArray = menus.split(",").map((menuId) => parseInt(menuId));

      for (const mealId of meals_id) {
        const ordersMealsInsertQuery = `
            INSERT INTO ordersmeals (order_id, meal_id)
            VALUES ($1, $2);
            `;
        const ordersMealsValues = [orderId, mealId];

        await Pool.query(ordersMealsInsertQuery, ordersMealsValues);
      }
      return res.json({ success: true });
      // const insertQuery = `
      //   INSERT INTO invoices (name, restaurant_id)
      //   VALUES ($1, $2)
      //   RETURNING id;
      //   `;

      // const values = [`invoice of ${restaurant_id}`, restaurant_id];
      // const invoiceResult = await Pool.query(insertQuery, values);
      // if (invoiceResult.rows.length > 0) {
      // }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || order(create).js | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const newOrderStatus = req.body.status;
    const orderID = req.params.id;

    const updateOrderStatusQuery = `UPDATE orders SET status = '${newOrderStatus}' WHERE id = '${orderID}'`;
    const updated = await Pool.query(updateOrderStatusQuery);

    if (updated?.rowCount) {
      return res.json({
        success: true,
        message: "Status Has Been Changed Successfully",
      });
    }
  } catch (e) {
    console.log(`400 || order(updateStatus).js | ${e}`);
    return res.json({ success: false, error: error.message });
  }
};

const getOrdersWithMealsAndIngredients = async (req, res) => {
  try {
    const query = `
        SELECT
          o.company_id, o.restaurant_id, o.employee_id,
          o.id AS order_id, o.created_at, o.updated_at,
          o.status,

          ARRAY_AGG(DISTINCT om.meal_id) AS meals_id,

          ARRAY_AGG(DISTINCT i.name) AS ingredient_names,
          ARRAY_AGG(DISTINCT me.name) AS meal_names,
          
          ARRAY_AGG(DISTINCT u.user_name) AS company,
          ARRAY_AGG(DISTINCT ur.user_name) AS restaurant,
          ARRAY_AGG(DISTINCT e.name) AS employee
          
          FROM orders o
          
          LEFT JOIN ordersmeals om ON o.id = om.order_id
          LEFT JOIN mealsingredients mi ON om.meal_id = mi.meal_id
          
          LEFT JOIN ingredients i ON mi.ingredient_id = i.id
          LEFT JOIN meals me ON mi.meal_id = me.id

          LEFT JOIN companies c on o.company_id = c.id
          LEFT JOIN users u on c.user_id = u.id
          
          LEFT JOIN restaurants r on o.restaurant_id = r.id
          LEFT JOIN users ur on r.user_id = ur.id
          
          LEFT JOIN employees e on o.employee_id = e.id
          
          GROUP BY o.id;
    `;
    const result = await Pool.query(query);

    if (result.rows) {
      const meals = await Pool.query(`select * from meals`);
      const restaurants = await Pool.query(
        "select r.*, u.user_name from restaurants r LEFT JOIN users u on r.user_id = u.id;"
      );
      const companies = await Pool.query(
        "select c.*, u.user_name from companies c LEFT JOIN users u on c.user_id = u.id;"
      );
      const employees = await Pool.query("select * from employees;");

      return res.json({
        success: true,
        orders: result.rows,
        meals: meals.rows,
        restaurants: restaurants.rows,
        companies: companies.rows,
        employees: employees.rows,
        status: ["pending", "ready-for-pickup", "in-kitchen", "delivered"],
      });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || order(getOrdersWithMealsAndIngredients).js | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  create,
  getOrdersWithMealsAndIngredients,
  updateOrderStatus,
};
