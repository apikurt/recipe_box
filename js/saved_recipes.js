const savedRecipesContainer = document.querySelector("#saved-recipes-container");

const savedRecipesTitle = document.querySelector("#saved-recipes-title");
const savedRecipes = getSavedRecipes();

savedRecipesTitle.textContent = `Saved Recipes (${savedRecipes.length})`;

if (savedRecipes.length === 0) {
  savedRecipesContainer.innerHTML = "<p>You have no saved recipes.</p>";
} else {
  savedRecipes.forEach((recipe) => {
    savedRecipesContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="recipe-card">
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image" />
        <h3 class="recipe-title">${recipe.strMeal}</h3>
        <div class="recipe-buttons"> 
            <a href="recipe.html?id=${recipe.idMeal}" class="btn primary">View Recipe</a>
            <button class="secondary unsave-recipe-button" data-recipe-id="${recipe.idMeal}">Unsave Recipe</button>
        </div>
      </div>`,
    );
  });

  const unsaveButtons = document.querySelectorAll(".unsave-recipe-button");
  unsaveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.getAttribute("data-recipe-id");
      unsaveRecipe(recipeId);
      button.parentElement.parentElement.remove();
      if (getSavedRecipes().length === 0) {
        savedRecipesContainer.innerHTML = "<p>You have no saved recipes.</p>";
      }
    });
  });
}
