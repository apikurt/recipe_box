const savedRecipesContainer = document.querySelector(
  "#saved-recipes-container",
);

const filterInput = document.querySelector("#filter-recipes");

const savedRecipesTitle = document.querySelector("#saved-recipes-title");
const savedRecipes = getSavedRecipes();

savedRecipesTitle.textContent = `Saved Recipes (${savedRecipes.length})`;

if (savedRecipes.length === 0) {
  savedRecipesContainer.innerHTML = "<p>You have no saved recipes.</p>";
} else {
  savedRecipes.forEach((recipe) => {
    const isPlanned = isRecipePlanned(recipe.idMeal);
    const imgUrl = recipe.strMealThumb
      ? recipe.strMealThumb
      : "/images/recipe_placeholder.png";
    savedRecipesContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="recipe-card">
        <img src="${imgUrl}" alt="${recipe.strMeal}" class="recipe-image" />
        <h3 class="recipe-title">${recipe.strMeal}</h3>
        <div class="recipe-buttons"> 
            <a href="recipe.html?id=${recipe.idMeal}" class="btn primary">View Recipe</a>
            <button class="secondary unsave-recipe-button" data-recipe-id="${recipe.idMeal}">Unsave Recipe</button>
            <button class="warning add-to-planner-button" data-recipe-id="${recipe.idMeal}" ${isPlanned ? "disabled" : ""}>${isPlanned ? "Planned" : "Add to Planner"}</button>
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
      savedRecipesTitle.textContent = `Saved Recipes (${getSavedRecipes().length})`;
      if (getSavedRecipes().length === 0) {
        savedRecipesContainer.innerHTML = "<p>You have no saved recipes.</p>";
      }
    });
  });
}

filterInput.addEventListener("input", () => {
  const filterValue = filterInput.value.toLowerCase().trim();
  const recipeCards = savedRecipesContainer.querySelectorAll(".recipe-card");

  if (filterValue === "") {
    recipeCards.forEach((card) => {
      card.style.display = "";
    });
    savedRecipesTitle.textContent = `Saved Recipes (${getSavedRecipes().length})`;
    return;
  }
  let visibleCount = 0;
  recipeCards.forEach((card) => {
    const title = card.querySelector(".recipe-title").textContent.toLowerCase();
    if (title.includes(filterValue)) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });
  savedRecipesTitle.textContent = `Saved Recipes (${visibleCount}/${getSavedRecipes().length})`;
});
