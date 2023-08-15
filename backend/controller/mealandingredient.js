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
    } = req.body;

    const query = `
        INSERT INTO meals (name, description, price, photo_location, restaurant_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
        `;
    const values = [name, description, price, photo_location, restaurant_id];
    const result = await Pool.query(query, values);

    if (result.rows.length > 0) {
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
    const { name, description, meals } = req.body;

    const ingredientQuery = `
      INSERT INTO ingredients (name, description)
      VALUES ($1, $2)
      RETURNING id;
    `;

    // Insert ingredient into ingredients table and get the ingredient ID
    const ingredientResult = await Pool.query(ingredientQuery, [
      name,
      description,
    ]);

    if (ingredientResult.rows.length > 0) {
      const ingredientId = ingredientResult.rows[0].id;

      const mealsArray = meals.split(",").map(mealId => parseInt(mealId));

      for (const mealId of mealsArray) {
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
    console.log(`400 || mealsandingredients(insertIngredient).js | ${error}`);
    return res.json({ success: false, error: error });
  }
}

const getMealsWithIngredients = async (req, res) => {
  try {
    const query = `
      SELECT m.*, ARRAY_AGG(i.id) AS ingredient_ids, ARRAY_AGG(i.name) AS ingredient_names
      FROM meals m
      LEFT JOIN mealsingredients mi ON m.id = mi.meal_id
      LEFT JOIN ingredients i ON mi.ingredient_id = i.id
      GROUP BY m.id;
    `;
    const result = await Pool.query(query);

    if (result.rows) {
      return res.json({ success: true, meals: result.rows });
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
      SELECT i.*, ARRAY_AGG(mi.meal_id) AS meals
      FROM ingredients i
      LEFT JOIN mealsingredients mi ON i.id = mi.ingredient_id
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
