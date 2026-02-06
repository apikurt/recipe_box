const searchForm = document.querySelector("#browse-recipes-form");
const errorMessage = document.querySelector("#error-message");
const cardsContainer = document.querySelector("#card-container");
const loader = document.querySelector(".loader");

const searchQuery =
  new URLSearchParams(window.location.search).get("search") || "";
if (searchQuery) {
  document.title = `Search results for "${searchQuery}" - Recipe Box`;
  searchForm.search.value = searchQuery;
  loader.classList.remove("d-none");
  searchRecipes(searchQuery).then((recipes) => {
    displayRecipes(recipes);
  });
}

errorMessage.classList.add("v-hidden");
errorMessage.textContent = "";

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = event.target.search.value.trim();
  if (!query) {
    alert("Please enter a search term.");
    return;
  }
  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
});

function searchRecipes(query) {
  const baseUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  return fetch(baseUrl + encodeURIComponent(query))
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((data) => {
      return data.meals || [];
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
      errorMessage.textContent =
        "Failed to fetch recipes. Please try again later.";
      errorMessage.classList.remove("v-hidden");
      return [];
    })
    .finally(() => {
      loader.classList.add("d-none");
    });
}

function displayRecipes(recipes) {
  cardsContainer.innerHTML = "";
  if (recipes.length === 0) {
    cardsContainer.insertAdjacentHTML(
      "beforeend",
      `<p>No recipes found for your search.</p>`,
    );
    return;
  }
  recipes.forEach((recipe) => {
    const isSaved = isRecipeSaved(recipe.idMeal);
    const buttonText = isSaved ? "Unsave Recipe" : "Save Recipe";
    const imgUrl = recipe.strMealThumb
      ? recipe.strMealThumb
      : "/images/recipe_placeholder.png";
    cardsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="recipe-card">
        <img src="${imgUrl}" alt="${recipe.strMeal}" class="recipe-image" />
        <h3 class="recipe-title">${recipe.strMeal}</h3>
        <div class="recipe-buttons"> 
            <a href="recipe.html?id=${recipe.idMeal}" class="btn primary">View Recipe</a>
            <button class="secondary save-recipe-button" data-recipe-id="${recipe.idMeal}">${buttonText}</button>
        </div>
      </div>`,
    );
  });
  const saveButtons = document.querySelectorAll(".save-recipe-button");
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.getAttribute("data-recipe-id");
      const recipe = recipes.find((r) => r.idMeal === recipeId);
      if (isRecipeSaved(recipeId)) {
        unsaveRecipe(recipeId);
        button.textContent = "Save Recipe";
      } else {
        saveRecipe(recipe);
        button.textContent = "Unsave Recipe";
      }
    });
  });
}
