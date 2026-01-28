const clearAllDataBtn = document.querySelector("#clear-all-data");
const resetPlannerBtn = document.querySelector("#reset-planner");
const exportDataBtn = document.querySelector("#export-data");
const importDataBtn = document.querySelector("#import-data");

clearAllDataBtn.addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to clear all data? This action cannot be undone.",
    )
  ) {
    clearAllData();
    alert("All data has been cleared.");
  }
});

resetPlannerBtn.addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to reset the weekly planner? This will remove all meals from your planner.",
    )
  ) {
    clearPlannerMeals();
  }
});

exportDataBtn.addEventListener("click", () => {
  const date = new Date();
  const timestamp = date
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")
    .replace("T", "_");
  const dataStr = exportData();
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `recipe_box_data_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

importDataBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataStr = e.target.result;
        importData(dataStr);
        alert("Data imported successfully.");
      } catch (error) {
        alert("Failed to import data. Please ensure the file is valid.");
      }
    };
    reader.readAsText(file);
  });
  input.click();
});

function clearAllData() {
  localStorage.clear();
}

function exportData() {
  const recipes = getSavedRecipes();
  const plannerMeals = getPlannerMeals();
  const shoppingList = getShoppingList();

  return JSON.stringify({ recipes, plannerMeals, shoppingList });
}

function importData(dataStr) {
  const data = JSON.parse(dataStr);
  if (data.recipes) {
    localStorage.setItem("savedRecipes", JSON.stringify(data.recipes));
  }
  if (data.plannerMeals) {
    localStorage.setItem("plannerMeals", JSON.stringify(data.plannerMeals));
  }
  if (data.shoppingList) {
    localStorage.setItem("shoppingList", JSON.stringify(data.shoppingList));
  }
}
