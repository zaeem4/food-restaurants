const express = require("express");
require("express-group-routes");
const cors = require("cors");

require("dotenv").config({ path: "config/.env" });

const Logger = require("./utils/logger");

const LoginController = require("./controller/login");
const adminController = require("./controller/admin");
const restaurantController = require("./controller/restaurant");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", LoginController.verify);

app.group("/api/admin", (router) => {
  router.post("/register", adminController.register);
  router.get("/role", adminController.role);

  router.get("/restaurants", restaurantController.getAllRestaurantsWithUsers);
  router.post("/restaurant/create", restaurantController.create);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend Started at Port ${process.env.SERVER_PORT}`);
});
