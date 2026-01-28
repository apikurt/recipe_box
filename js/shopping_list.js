const clearShoppingListButton = document.querySelector("#clear-list-button");
const shoppingListContainer = document.querySelector(
  "#shopping-list-container",
);

function displayShoppingList() {
  const shoppingList = getShoppingList();
  shoppingListContainer.innerHTML = "";
  if (shoppingList.length === 0) {
    shoppingListContainer.innerHTML = "<p>Your shopping list is empty.</p>";
    return;
  }

  clearShoppingListButton.classList.remove("v-hidden");
  shoppingList.forEach((ingredient) => {
    const listItem = document.createElement("div");
    listItem.className = "shopping-list-item";
    const textSpan = document.createElement("span");
    textSpan.className = "ingredient-text";
    textSpan.textContent = ingredient;
    const removeButton = document.createElement("button");
    removeButton.classList.add("danger", "btn-small", "remove-button");
    // Accessible label and default visible text for larger screens
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", "Remove");
    removeButton.addEventListener("click", () => {
      removeFromShoppingList(ingredient);
      displayShoppingList();
    });
    listItem.appendChild(textSpan);
    listItem.appendChild(removeButton);
    shoppingListContainer.appendChild(listItem);
  });
}

clearShoppingListButton.addEventListener("click", () => {
  clearShoppingList();
  displayShoppingList();
});

// Initial display
displayShoppingList();
