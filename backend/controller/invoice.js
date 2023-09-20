const Pool = require("../config/db");
const transport = require("../config/mailer");
const Logger = require("../utils/logger");

const pdf = require("pdf-creator-node");
const fs = require("fs");
const ejs = require("ejs");

const get = async (req, res) => {
  try {
    const query = `
      SELECT i.*, u.user_name as restaurant, u.email as restaurant_email, 
      cu.user_name as company, cu.email as company_email
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
    return res.json({ success: false, error: error.message });
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
        
        ARRAY_AGG(me.price) AS prices,
        
        SUM(CASE WHEN me.price IS NOT NULL THEN me.price ELSE 0 END) AS total_prices
        FROM orders o
        
        LEFT JOIN ordersmeals om ON o.id = om.order_id
        LEFT JOIN meals me ON om.meal_id = me.id

        WHERE o.created_at >= '${start_date.split("T")[0]}' 
        AND o.created_at <= '${end_date.split("T")[0]}' 

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

      if (!company_id) {
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
          totalPricesSum,
          0,
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
    return res.json({ success: false, error: error.message });
  }
};

const generateForAdmin = async (req, res) => {
  try {
    if (!req.body.invoiceData.file_location) {
      const query = `
        SELECT i.*, r.*, u.*
        FROM invoices i
        LEFT JOIN restaurants r ON i.restaurant_id = r.id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE i.id = '${req.body.invoiceData.id}';
      `;
      const result = await Pool.query(query);
      if (result.rows.length > 0) {
        const template = fs.readFileSync("public/admin-invoice.html", "utf8");
        const html = ejs.render(template);

        result.rows[0]["created_at"] = new Date(
          result.rows[0]["created_at"]
        ).toLocaleDateString();

        let document = {
          html: html,
          data: {
            invoiceData: result.rows[0],
          },
          path: `public/invoices/inv-${req.body.invoiceData.id}.pdf`,
          // type: "file",
        };
        const response = await pdf.create(document, {
          format: "A3",
          orientation: "landscape",
          border: "20mm",
          childProcessOptions: {
            env: {
              OPENSSL_CONF: "/dev/null",
            },
          },
        });
        if (response.filename) {
          const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.invoiceData.restaurant_email,
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
          const isUpdated = await Pool.query(
            `UPDATE invoices set file_location = '${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf' where id = '${req.body.invoiceData.id}'`
          );
          return res.json({
            success: true,
            filePath: `${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf`,
          });
        }
      }
    } else {
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.invoiceData.restaurant_email,
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
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(generateForAdmin) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};
const generateForRestaurant = async (req, res) => {
  try {
    if (!req.body.invoiceData.file_location) {
      const query = `
        SELECT i.*, r.address as r_address,r.city as r_city, r.tax_number as r_tax_number, r.phone as r_phone,r.owner as r_owner,
        c.address as c_address,c.city as c_city, c.tax_number as c_tax_number, c.phone as c_phone,c.owner as c_owner, 
        u.user_name as r_user_name,u.email as r_email, cu.user_name as c_user_name, cu.email as c_email
        FROM invoices i
        LEFT JOIN restaurants r ON i.restaurant_id = r.id
        LEFT JOIN companies c ON i.company_id = c.id
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN users cu ON c.user_id = cu.id
        WHERE i.id = '${req.body.invoiceData.id}';
      `;
      
      const result = await Pool.query(query);

      if (result.rows.length > 0) {
        const query = `
          SELECT o.id, 
          ARRAY_AGG(DISTINCT me.name) AS meals_name,
          ARRAY_AGG(me.price) AS prices,

          SUM(CASE WHEN me.price IS NOT NULL THEN me.price ELSE 0 END) AS total_prices
          FROM orders o
          
          LEFT JOIN ordersmeals om ON o.id = om.order_id
          LEFT JOIN meals me ON om.meal_id = me.id
          
          WHERE o.created_at >= '${result.rows[0].start_date
            .toLocaleDateString()
            .replaceAll("/", "-")}' 
          AND o.created_at <= '${result.rows[0].end_date
            .toLocaleDateString()
            .replaceAll("/", "-")}'
          AND o.restaurant_id = '${result.rows[0].restaurant_id}'
          AND o.company_id = '${result.rows[0].company_id}'

          GROUP BY o.id;
        `;

        const invoiceMenus = await Pool.query(query);

        result.rows[0]["created_at"] = new Date(
          result.rows[0]["created_at"]
        ).toLocaleDateString();

        const template = fs.readFileSync(
          "public/restaurant-invoice.html",
          "utf8"
        );
        const html = ejs.render(template);

        let document = {
          html: html,
          data: {
            invoiceData: result.rows[0],
            invoiceMenus: invoiceMenus.rows,
          },
          path: `public/invoices/inv-${req.body.invoiceData.id}.pdf`,
          // type: "",
        };
        const response = await pdf.create(document, {
          format: "A3",
          orientation: "landscape",
          border: "20mm",
          childProcessOptions: {
            env: {
              OPENSSL_CONF: "/dev/null",
            },
          },
        });
        if (response.filename) {
          const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.invoiceData.company_email,
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
          const isUpdated = await Pool.query(
            `UPDATE invoices set file_location = '${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf' where id = '${req.body.invoiceData.id}'`
          );
          return res.json({
            success: true,
            filePath: `${process.env.SERVER_URL}/static/invoices/inv-${req.body.invoiceData.id}.pdf`,
          });
        }
      }
    } else {
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.invoiceData.company_email,
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
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 invoice(generateForRestaurant) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  get,
  create,
  generateForAdmin,
  generateForRestaurant,
};
