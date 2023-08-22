const Pool = require("../config/db");

const Logger = require("../utils/logger");

const insertMeal = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      photo_location = null,
      restaurant_id,
      ingredients,
    } = req.body;

    const query = `
        INSERT INTO meals (name, description, price, photo_location, restaurant_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
        `;
    const values = [name, description, price, photo_location, restaurant_id];
    const mealsResult = await Pool.query(query, values);

    if (mealsResult.rows.length > 0) {
      const mealId = mealsResult.rows[0].id;

      // const ingredientIdArray = ingredients
      //   .split(",")
      //   .map((ingredientId) => parseInt(ingredientId));

      for (const ingredientId of ingredients) {
        const mealIngredientQuery = `
            INSERT INTO mealsingredients (meal_id, ingredient_id)
            VALUES ($1, $2);
        `;
        const mealIngredientValues = [mealId, ingredientId];
        await Pool.query(mealIngredientQuery, mealIngredientValues);
      }
      return res.json({ success: true });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || mealsandingredients(insertMeal).js | ${error}`);
    return res.json({ success: false, error: error });
  }
};

async function insertIngredient(req, res) {
  try {
    const { name, description } = req.body;

    const ingredientQuery = `
      INSERT INTO ingredients (name, description)
      VALUES ($1, $2)
      RETURNING id;
    `;

    // Insert ingredient into ingredients table and get the ingredient ID
    const result = await Pool.query(ingredientQuery, [name, description]);

    if (result.rows.length > 0) {
      return res.json({ success: true });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(`400 || mealsandingredients(insertIngredient).js | ${error}`);
    return res.json({ success: false, error: error });
  }
}

const getMealsWithIngredients = async (req, res) => {
  try {
    const query = `
      SELECT m.*, ARRAY_AGG(i.id) AS ingredients, ARRAY_AGG(i.name) AS ingredients_name
      FROM meals m
      LEFT JOIN mealsingredients mi ON m.id = mi.meal_id
      LEFT JOIN ingredients i ON mi.ingredient_id = i.id
      GROUP BY m.id;
    `;
    const result = await Pool.query(query);

    if (result.rows) {
      const ingredients = await Pool.query("select * from ingredients;");
      const restaurants = await Pool.query(
        "select r.*, u.user_name from restaurants r JOIN users u on r.user_id = u.id;"
      );

      return res.json({
        success: true,
        meals: result.rows,
        ingredients: ingredients.rows,
        restaurants: restaurants.rows,
      });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(
      `400 || mealsandingredients(getMealsWithIngredients).js | ${error}`
    );
    return res.json({ success: false, error: error });
  }
};

const getIngredientsWithMeals = async (req, res) => {
  try {
    const query = `
      SELECT i.*, ARRAY_AGG(mi.meal_id) AS meals, ARRAY_AGG(m.name) AS meals_name
      FROM ingredients i
      LEFT JOIN mealsingredients mi ON i.id = mi.ingredient_id
      LEFT JOIN meals m on mi.meal_id = m.id
      GROUP BY i.id;
    `;
    const result = await Pool.query(query);
    if (result.rows) {
      return res.json({ success: true, ingredients: result.rows });
    }
    return res.json({ success: false, error: "error in db" });
  } catch (error) {
    console.log(
      `400 || mealsandingredients(getIngredientsWithMeals).js | ${error}`
    );
    return res.json({ success: false, error: error });
  }
};

module.exports = {
  insertMeal,
  insertIngredient,
  getMealsWithIngredients,
  getIngredientsWithMeals,
};
