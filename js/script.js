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

function isRecipeSaved(recipeId) {
  const savedRecipes = getSavedRecipes();
  return savedRecipes.some((r) => r.idMeal === recipeId);
}
