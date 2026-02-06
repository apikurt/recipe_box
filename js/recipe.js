const recipeId = new URLSearchParams(window.location.search).get("id");
const recipeContainer = document.querySelector("#recipe-details");
const loader = document.querySelector(".loader");
const errorMessage = document.querySelector("#error-message");
errorMessage.classList.add("d-none");

if (recipeId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((data) => {
      const recipe = data.meals[0];
      document.title = `${recipe.strMeal} - Recipe Box`;

      displayRecipe(recipe);
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
      errorMessage.textContent =
        "Failed to fetch recipe details. Please try again later.";
      errorMessage.classList.remove("d-none");
    })
    .finally(() => {
      loader.classList.add("d-none");
    });
} else {
  console.error("No recipe ID provided in URL.");
  errorMessage.textContent =
    "No recipe ID provided. Please go back and select a recipe.";
  errorMessage.classList.remove("d-none");
}

function displayRecipe(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push({
        ingredient: ingredient,
        measure: measure,
      });
    } else {
      break;
    }
  }

  const isSaved = isRecipeSaved(recipe.idMeal);
  const isPlanned = isRecipePlanned(recipe.idMeal);
  const saveButtonText = isSaved ? "Unsave Recipe" : "Save Recipe";
  const plannedButtonText = isPlanned ? "Planned" : "Add to Planner";
  const imgUrl = recipe.strMealThumb
    ? recipe.strMealThumb
    : "/images/recipe_placeholder.png";
  recipeContainer.insertAdjacentHTML(
    "afterbegin",
    `
    <section class="recipe-top-section">
    <h2 class="recipe-title">${recipe.strMeal}</h2>
    <div class="recipe-buttons">
      <button id="save-recipe-button" class="primary">${saveButtonText}</button>
      <button class="warning add-to-planner-button" data-recipe-id="${recipe.idMeal}" ${isPlanned ? "disabled" : ""}>${plannedButtonText}</button>
    </div>
    </section>
    ${recipe.strTags ? `<span class="recipe-tags">${recipe.strTags.split(",").join(", ")}</span>` : ""}
    <section class="recipe-mid-section">
      <img src="${imgUrl}" alt="${recipe.strMeal}" class="recipe-image" />
      <div class="ingredients-section">
      <h3 class="ingredients-header">Ingredients</h3>
      <ul class="ingredients-list">
        ${ingredients
          .map((ingredient) => {
            const isAdded = isInShoppingList(ingredient.ingredient);
            if (isAdded) {
              return `<li class="ingredient-item">${ingredient.measure} ${ingredient.ingredient} <button class="remove-from-shopping-list-button danger btn-small" data-ingredient="${ingredient.ingredient}" title="Remove from Shopping List">-</button></li>`;
            }

            return `<li class="ingredient-item">${ingredient.measure} ${ingredient.ingredient} <button class="add-to-shopping-list-button primary btn-small" data-ingredient="${ingredient.ingredient}" title="Add to Shopping List">+</button></li>`;
          })
          .join("")}
      </ul>
      </div>
    </section>
    <h3 class="instructions-header">Instructions</h3>
    <p class="instructions-text">${recipe.strInstructions}</p>
  `,
  );

  document
    .querySelectorAll(".add-to-shopping-list-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const ingredient = button.getAttribute("data-ingredient");
        addToShoppingList(ingredient);
        button.classList.remove("add-to-shopping-list-button");
        button.classList.add("remove-from-shopping-list-button");
        button.textContent = "-";
        button.title = "Remove from Shopping List";
        button.classList.remove("primary");
        button.classList.add("danger");
      });
    });

  document
    .querySelectorAll(".remove-from-shopping-list-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const ingredient = button.getAttribute("data-ingredient");
        removeFromShoppingList(ingredient);
        button.classList.remove("remove-from-shopping-list-button");
        button.classList.add("add-to-shopping-list-button");
        button.textContent = "+";
        button.title = "Add to Shopping List";
        button.classList.add("primary");
        button.classList.remove("danger");
      });
    });

  if (recipe.strYoutube) {
    const youtubeUrl = new URL(recipe.strYoutube);
    const videoId = youtubeUrl.searchParams.get("v");
    recipeContainer.insertAdjacentHTML(
      "beforeend",
      `
      <h3 class="video-header">Video Tutorial</h3>
      <iframe
        width="100%"
        style="aspect-ratio: 16 / 9;"
        src="https://www.youtube.com/embed/${videoId}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `,
    );
  }
  document
    .getElementById("save-recipe-button")
    .addEventListener("click", () => {
      if (isRecipeSaved(recipeId)) {
        unsaveRecipe(recipeId);
        document.getElementById("save-recipe-button").textContent =
          "Save Recipe";
      } else {
        saveRecipe(recipe);
        document.getElementById("save-recipe-button").textContent =
          "Unsave Recipe";
      }
    });
}
