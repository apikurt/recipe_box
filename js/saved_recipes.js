const savedRecipesContainer = document.querySelector(
  "#saved-recipes-container",
);

const dialog = document.querySelector("#planner-dialog");
const dialogForm = dialog.querySelector("form");
const dialogCloseButton = dialog.querySelector("#planner-dialog-cancel");
dialogCloseButton.addEventListener("click", () => {
  dialogForm.querySelector(".hidden-recipe-id").remove();
  dialog.close();
});

const savedRecipesTitle = document.querySelector("#saved-recipes-title");
const savedRecipes = getSavedRecipes();

savedRecipesTitle.textContent = `Saved Recipes (${savedRecipes.length})`;

if (savedRecipes.length === 0) {
  savedRecipesContainer.innerHTML = "<p>You have no saved recipes.</p>";
} else {
  savedRecipes.forEach((recipe) => {
    const isPlanned = isRecipePlanned(recipe.idMeal);
    savedRecipesContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="recipe-card">
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image" />
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
      if (getSavedRecipes().length === 0) {
        savedRecipesContainer.innerHTML = "<p>You have no saved recipes.</p>";
      }
    });
  });

  const addToPlannerButtons = document.querySelectorAll(
    ".add-to-planner-button",
  );
  addToPlannerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.getAttribute("data-recipe-id");
      const recipe = savedRecipes.find((r) => r.idMeal === recipeId);
      dialogForm.insertAdjacentHTML(
        "afterbegin",
        `
        <input type="hidden" name="recipe-id" value="${recipeId}" class="hidden-recipe-id" />
      `,
      );
      dialog.showModal();
    });
  });
}

dialogForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const day = dialogForm.elements["day-select"].value;
  const mealType = dialogForm.elements["meal-type"].value;
  const recipeId = dialogForm.elements["recipe-id"].value;
  const recipe = savedRecipes.find((r) => r.idMeal === recipeId);
  savePlannerMeal(day, mealType, recipe);
  dialog.close();
  const addToPlannerButton = document.querySelector(
    `.add-to-planner-button[data-recipe-id="${recipeId}"]`,
  );
  addToPlannerButton.textContent = "Planned";
  addToPlannerButton.disabled = true;
});
