document.body.insertAdjacentHTML(
  "beforeend",
  `      <dialog id="planner-dialog">
        <form method="dialog" class="dialog-form">
          <h2 id="planner-dialog-title">Add to Planner</h2>
          <label for="meal-type-select">Select Meal Type:</label>
          <select id="meal-type-select" name="meal-type" required>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <br>
          <label for="day-select">Select Day:</label>
          <select id="day-select" name="day-select" required>
            <option value="Monday" selected>Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <div class="dialog-buttons">
            <button type="submit" class="primary">Add</button>
            <button
              type="button"
              class="warning"
              id="planner-dialog-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>`,
);

const dialog = document.querySelector("#planner-dialog");
const dialogForm = dialog.querySelector("form");
const dialogCloseButton = dialog.querySelector("#planner-dialog-cancel");

dialogCloseButton.addEventListener("click", () => {
  dialogForm.querySelector(".hidden-recipe-id").remove();
  dialog.close();
});

document.addEventListener("click", (e) => {
  const button = e.target.closest(".add-to-planner-button");
  if (!button) return;
  const recipeId = button.getAttribute("data-recipe-id");
  dialogForm.insertAdjacentHTML(
    "afterbegin",
    `
        <input type="hidden" name="recipe-id" value="${recipeId}" class="hidden-recipe-id" />
      `,
  );
  dialog.showModal();
});

dialogForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const day = dialogForm.elements["day-select"].value;
  const mealType = dialogForm.elements["meal-type"].value;
  const recipeId = dialogForm.elements["recipe-id"].value;
  const savedRecipes = getSavedRecipes();
  const recipe = savedRecipes.find((r) => r.idMeal === recipeId);
  dialogForm.querySelector(".hidden-recipe-id").remove();
  dialogForm.reset();
  savePlannerMeal(day, mealType, recipe);
  dialog.close();
  const addToPlannerButton = document.querySelector(
    `.add-to-planner-button[data-recipe-id="${recipeId}"]`,
  );
  addToPlannerButton.textContent = "Planned";
  addToPlannerButton.disabled = true;
});
