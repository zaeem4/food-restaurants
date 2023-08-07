const express = require("express");
require("express-group-routes");
const cors = require("cors");

require("dotenv").config({ path: "config/.env" });

const Logger = require("./utils/logger");

const LoginController = require("./controller/login");
const adminController = require("./controller/admin");
const restaurantController = require("./controller/restaurant");
const mealsAndIngredientController = require("./controller/mealandingredient");
const invoiceController = require("./controller/invoice");
const companyController = require("./controller/company");
const menuController = require("./controller/menu");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", LoginController.verify);

app.group("/api/admin", (router) => {
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

  router.get("/total-counts", adminController.getTotalCounts);

});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend Started at Port ${process.env.SERVER_PORT}`);
});
