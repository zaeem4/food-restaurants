const express = require("express");
require("express-group-routes");
const cors = require("cors");
// const multer = require("multer");
// const path = require("path");

require("dotenv").config({ path: "config/.env" });

const Logger = require("./utils/logger");

const LoginController = require("./controller/login");
const adminController = require("./controller/admin");
const restaurantController = require("./controller/restaurant");
const mealsAndIngredientController = require("./controller/mealandingredient");
const invoiceController = require("./controller/invoice");
const companyController = require("./controller/company");
const menuController = require("./controller/menu");
const orderController = require("./controller/order");
const employeeController = require("./controller/employee");
const kitchenController = require("./controller/kitchen");

const { AuthMiddleware } = require("./niddleware/verify-token");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/static", express.static(__dirname + "/public"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Directory where files will be stored
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const extname = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + extname);
//   },
// });

// const upload = multer({ storage });
// app.post("/upload-file", upload.single("pdf"), (req, res) => {
//   res.status(200).send("PDF uploaded successfully.");
// });

app.post("/api/login", LoginController.verify);
app.post("/api/verify-and-send-pin", LoginController.verifyEmail);
app.post("/api/verify-pin", LoginController.verifyPin);
app.post("/api/reset-password", LoginController.resetPassword);

app.group("/api/admin", (router) => {
  router.use(AuthMiddleware);

  router.post("/register", adminController.register);

  router.get("/role", adminController.role);

  router.get("/restaurants", restaurantController.getAllRestaurantsWithUsers);
  router.post("/restaurant/create", restaurantController.create);

  router.get("/meals", mealsAndIngredientController.getMealsWithIngredients);
  router.post("/meals/create", mealsAndIngredientController.insertMeal);

  router.get(
    "/ingredients",
    mealsAndIngredientController.getIngredientsWithMeals
  );
  router.post(
    "/ingredients/create",
    mealsAndIngredientController.insertIngredient
  );

  router.get("/invoices", invoiceController.get);
  router.post("/invoices/create", invoiceController.create);

  router.get("/companies", companyController.getAllCompaniesWithUsers);
  router.post("/companies/create", companyController.create);

  router.get("/menus", menuController.get);
  router.post("/menus/create", menuController.create);

  router.get("/orders", orderController.getOrdersWithMealsAndIngredients);
  router.post("/orders/create", orderController.create);
  router.put("/order/:id", orderController.updateOrderStatus);

  router.get("/invoices", invoiceController.get);

  router.get("/total-counts", adminController.getTotalCounts);

  router.get("/employees", employeeController.get);
  router.post("/employees/create", employeeController.create);

  router.get("/kitchens", kitchenController.get);
  router.post("/kitchens/create", kitchenController.create);

  router.post("/generate-pdf-by-admin", invoiceController.generateForAdmin);
  router.post(
    "/generate-pdf-by-restaurant",
    invoiceController.generateForRestaurant
  );
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend Started at Port ${process.env.SERVER_PORT}`);
});
