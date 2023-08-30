const Pool = require("../config/db");

const Logger = require("../utils/logger");

const create = async (req, res) => {
  try {
    const { name, status, company_id, restaurant_id, employee_id, menus_id } =
      req.body;

    let employee;
    if (!employee_id || employee_id === " ") {
      employee = null;
    } else {
      employee = employee_id;
    }

    const query = `
        INSERT INTO Orders (name, status, company_id, restaurant_id, employee_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    const values = [
      name,
      status.toLowerCase(),
      company_id,
      restaurant_id,
      employee,
    ];
    const orderResult = await Pool.query(query, values);

    if (orderResult.rows.length > 0) {
      const orderId = orderResult.rows[0].id;
      // const menusArray = menus.split(",").map((menuId) => parseInt(menuId));

      for (const menuId of menus_id) {
        const ordersMenusInsertQuery = `
            INSERT INTO OrdersMenus (order_id, menu_id)
            VALUES ($1, $2);
            `;
        const ordersMenusValues = [orderId, menuId];

        await Pool.query(ordersMenusInsertQuery, ordersMenusValues);
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
    return res.json({ success: false, error: error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const newOrderStatus = req.body.status;
    const orderID = req.params.id;

    let updateOrderStatusQuery = `UPDATE orders SET status = '${newOrderStatus}' WHERE id = '${orderID}'`;
    const updated = await Pool.query(updateOrderStatusQuery);
    console.log(updated);
    if (updated?.rowCount) {
      return res.json({
        success: true,
        message: "Status Has Been Changed Successfully",
      });
    }
  } catch (e) {
    console.log(`400 || order(updateStatus).js | ${e}`);
    return res.json({ success: false, error: error });
  }
};

const getOrdersWithMenusAndIngredients = async (req, res) => {
  try {
    const query = `
        SELECT
          o.company_id, o.restaurant_id, o.employee_id,
          o.id AS order_id, o.created_at, o.updated_at,
          o.status, o.name,

          ARRAY_AGG(DISTINCT om.menu_id) AS menus_id,
          ARRAY_AGG(DISTINCT i.name) AS ingredient_names,
          ARRAY_AGG(DISTINCT m.name) AS menus,
          ARRAY_AGG(DISTINCT u.user_name) AS company,
          ARRAY_AGG(DISTINCT ur.user_name) AS restaurant,
          ARRAY_AGG(DISTINCT e.name) AS employee
          
          FROM Orders o
          
          LEFT JOIN OrdersMenus om ON o.id = om.order_id
          LEFT JOIN menus m ON om.menu_id = m.id
          LEFT JOIN MealsIngredients mi ON m.meal_id = mi.meal_id
          LEFT JOIN ingredients i ON mi.ingredient_id = i.id
          LEFT JOIN companies c on o.company_id = c.id
          LEFT JOIN users u on c.user_id = u.id
          LEFT JOIN restaurants r on o.restaurant_id = r.id
          LEFT JOIN users ur on r.user_id = ur.id
          LEFT JOIN employees e on o.employee_id = e.id
          
          GROUP BY o.id;
    `;
    const result = await Pool.query(query);

    if (result.rows) {
      const menus = await Pool.query(`select * from menus`);
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
        menus: menus.rows,
        restaurants: restaurants.rows,
        companies: companies.rows,
        employees: employees.rows,
        status: ["pending", "ready-for-pickup", "in-kitchen", "delivered"],
      });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || order(getOrdersWithMenusAndIngredients).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

module.exports = {
  create,
  getOrdersWithMenusAndIngredients,
  updateOrderStatus,
};
