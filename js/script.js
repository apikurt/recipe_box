// Setting footer year dynamically
const footerYearElement = document.getElementById("footer-year");
const currentYear = new Date().getFullYear();
footerYearElement.textContent = currentYear;

function getSavedRecipes() {
  const savedRecipes = localStorage.getItem("savedRecipes");
  return savedRecipes ? JSON.parse(savedRecipes) : [];
}

function saveRecipe(recipe) {
  const savedRecipes = getSavedRecipes();
  if (!savedRecipes.find((r) => r.idMeal === recipe.idMeal)) {
    savedRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    alert("Recipe saved!");
  } else {
    alert("Recipe is already saved.");
  }
}
function unsaveRecipe(recipeId) {
  let savedRecipes = getSavedRecipes();
  savedRecipes = savedRecipes.filter((r) => r.idMeal !== recipeId);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  alert("Recipe removed from saved recipes.");
}

function clearSavedRecipes() {
  localStorage.removeItem("savedRecipes");
  alert("All saved recipes cleared.");
}

function isRecipeSaved(recipeId) {
  const savedRecipes = getSavedRecipes();
  return savedRecipes.some((r) => r.idMeal === recipeId);
}

function getShoppingList() {
  const shoppingList = localStorage.getItem("shoppingList");
  return shoppingList ? JSON.parse(shoppingList) : [];
}

function addToShoppingList(ingredient) {
  const shoppingList = getShoppingList();
  if (!shoppingList.includes(ingredient)) {
    shoppingList.push(ingredient);
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    alert(`${ingredient} added to shopping list.`);
  } else {
    alert(`${ingredient} is already in the shopping list.`);
  }
}

function isInShoppingList(ingredient) {
  const shoppingList = getShoppingList();
  return shoppingList.includes(ingredient);
}

function clearShoppingList() {
  localStorage.removeItem("shoppingList");
  alert("Shopping list cleared.");
}

function removeFromShoppingList(ingredient) {
  let shoppingList = getShoppingList();
  shoppingList = shoppingList.filter((item) => item !== ingredient);
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  alert(`${ingredient} removed from shopping list.`);
}

function getPlannerMeals() {
  const plannerMeals = localStorage.getItem("plannerMeals");
  return plannerMeals ? JSON.parse(plannerMeals) : {};
}

function savePlannerMeal(day, mealType, recipe) {
  const plannerMeals = getPlannerMeals();
  if (!plannerMeals[day]) {
    plannerMeals[day] = {};
  }
  plannerMeals[day][mealType] = recipe;
  localStorage.setItem("plannerMeals", JSON.stringify(plannerMeals));
  alert(`${mealType} for ${day} saved.`);
}

function removePlannerMeal(day, mealType) {
  const plannerMeals = getPlannerMeals();
  if (plannerMeals[day] && plannerMeals[day][mealType]) {
    delete plannerMeals[day][mealType];
    localStorage.setItem("plannerMeals", JSON.stringify(plannerMeals));
    alert(`${mealType} for ${day} removed.`);
  }
}

function isRecipePlanned(recipeId) {
  const plannerMeals = getPlannerMeals();
  for (const day in plannerMeals) {
    for (const mealType in plannerMeals[day]) {
      if (plannerMeals[day][mealType].idMeal === recipeId) {
        return true;
      }
    }
  }
  return false;
}

function clearPlannerMeals() {
  localStorage.removeItem("plannerMeals");
  alert("All planner meals cleared.");
}
