const Pool = require("../config/db");
const transport = require("../config/mailer");

const Logger = require("../utils/logger");

const pdf = require("pdf-creator-node");
const fs = require("fs");

const get = async (req, res) => {
  try {
    const query = `
      SELECT i.*, u.user_name as restaurant, cu.user_name as company 
      FROM invoices i
      LEFT JOIN restaurants r on i.restaurant_id = r.id
      LEFT JOIN companies c on i.company_id = c.id
      LEFT JOIN users cu on c.user_id = cu.id 
      LEFT JOIN users u on r.user_id = u.id;
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      const restaurants = await Pool.query(
        "select r.*, u.user_name from restaurants r LEFT JOIN users u on r.user_id = u.id;"
      );
      const companies = await Pool.query(
        "select c.*, u.user_name from companies c LEFT JOIN users u on c.user_id = u.id;"
      );
      return res.json({
        success: true,
        invoices: result.rows,
        restaurants: restaurants.rows,
        companies: companies.rows,
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
    const {
      name,
      file_location = null,
      start_date,
      end_date,
      restaurant_id = null,
      company_id = null,
    } = req.body;

    let andQuery = null;
    if (company_id) {
      andQuery = `AND o.restaurant_id = '${restaurant_id}' and o.company_id = '${company_id}'`;
    } else {
      andQuery = `AND o.restaurant_id = '${restaurant_id}'`;
    }
    const query = `
      SELECT
        o.id, o.created_at, o.restaurant_id,
        ARRAY_AGG(DISTINCT om.menu_id) AS menus_id,
        ARRAY_AGG(DISTINCT me.price) AS prices,
        SUM(CASE WHEN me.price IS NOT NULL THEN me.price ELSE 0 END) AS total_prices
        FROM Orders o
        LEFT JOIN OrdersMenus om ON o.id = om.order_id
        LEFT JOIN menus mu ON om.menu_id = mu.id
        LEFT JOIN meals me ON mu.meal_id = me.id
        WHERE o.created_at >= '${start_date}' 
        AND o.created_at <= '${end_date}' 
        ${andQuery}
        GROUP BY o.id;
    `;

    const orders_prices = await Pool.query(query);

    if (orders_prices.rows.length > 0) {
      const ordersWithTotalPrices = orders_prices.rows;
      // Calculate the sum of total_prices
      const totalPricesSum = ordersWithTotalPrices.reduce(
        (sum, order) => sum + parseFloat(order.total_prices),
        0
      );

      let restaurant = await Pool.query(
        `SELECT * from restaurants where id = '${restaurant_id}';`
      );

      if (restaurant.rows.length > 0) {
        let amount = 0;
        let fee = 0;
        restaurant = restaurant.rows[0];

        if (restaurant.fee_type == "fixed amount") {
          amount = totalPricesSum;
          fee = restaurant.fee_value;
        } else if (restaurant.fee_type == "fixed percentage per order") {
          amount = totalPricesSum;
          fee = totalPricesSum * (restaurant.fee_value / 100);
        } else if (restaurant.fee_type == "fixed amount per order") {
          amount = totalPricesSum;
          fee = ordersWithTotalPrices.length * restaurant.fee_value;
        }

        const query = `
            INSERT INTO invoices (name, file_location, start_date, end_date, amount, fee, restaurant_id, company_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;
        const values = [
          name,
          file_location,
          start_date.split("T")[0],
          end_date.split("T")[0],
          amount,
          fee,
          restaurant_id,
          company_id,
        ];
        const result = await Pool.query(query, values);

        if (result.rows.length > 0) {
          return res.json({ success: true });
        }
      }
    } else {
      return res.json({
        success: false,
        error: "NO orders between this date range",
      });
    }

    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(create) | ${error}`);
    return res.json({ success: false, error: error });
  }
};

const generateForAdmin = async (req, res) => {
  try {
    const query = `
      SELECT i.*, r.*, u.*
      FROM invoices i
      LEFT JOIN restaurants r ON i.restaurant_id = r.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE i.id = '${req.body.invoiceData.id}';
    `;
    const result = await Pool.query(query);
    if (result.rows.length > 0) {
      const html = fs.readFileSync("public/admin-invoice.html", "utf8");

      const document = {
        html: html,
        data: {
          invoiceData: result.rows[0],
        },
        path: `public/invoices/inv-${req.body.invoiceData.id}.pdf`,
        // type: "",
      };
      const response = await pdf.create(document, {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      });
      if (response.filename) {
        const mailOptions = {
          from: "zaeem1169@gmail.com",
          to: "zaeem1169@gmail.com",
          subject: "INVOICE | BY ADMIN",
          html: "<b>Check your invoice now in attachment</b>",
          attachments: [
            {
              filename: `inv-${req.body.invoiceData.id}.pdf`,
              path: `${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf`,
              // cid: "uniq-mailtrap.png",
            },
          ],
        };
        const isSend = await transport.sendMail(mailOptions);
        return res.json({
          success: true,
          filePath: `${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf`,
        });
      }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(generateForAdmin) | ${error}`);
    return res.json({ success: false, error: error });
  }
};
const generateForRestaurant = async (req, res) => {
  try {
    const query = `
      SELECT i.*, r.*, u.*
      FROM invoices i
      LEFT JOIN restaurants r ON i.restaurant_id = r.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE i.id = '${req.body.invoiceData.id}';
    `;
    const result = await Pool.query(query);
    if (result.rows.length > 0) {
      const html = fs.readFileSync("public/admin-invoice.html", "utf8");

      const document = {
        html: html,
        data: {
          invoiceData: result.rows[0],
        },
        path: `public/invoices/inv-${req.body.invoiceData.id}.pdf`,
        // type: "",
      };
      const response = await pdf.create(document, {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      });
      if (response.filename) {
        const mailOptions = {
          from: "zaeem1169@gmail.com",
          to: "zaeem1169@gmail.com",
          subject: "INVOICE | BY Restaurant",
          html: "<b>Check your invoice now in attachment</b>",
          attachments: [
            {
              filename: `inv-${req.body.invoiceData.id}.pdf`,
              path: `${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf`,
              // cid: "uniq-mailtrap.png",
            },
          ],
        };
        const isSend = await transport.sendMail(mailOptions);

        return res.json({
          success: true,
          filePath: `${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf`,
        });
      }
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(generateForRestaurant) | ${error}`);
    return res.json({ success: false, error: error });
  }
};

module.exports = {
  get,
  create,
  generateForAdmin,
  generateForRestaurant,
};
