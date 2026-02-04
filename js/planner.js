const daysRow = document.querySelector(".days-row");
const tableBody = document.querySelector("table tbody");
const tableCaption = document.querySelector("table caption");

const plannerMeals = getPlannerMeals();

if (plannerMeals && Object.keys(plannerMeals).length === 0) {
  tableCaption.insertAdjacentHTML(
    "beforeend",
    "<br><span>No meals planned yet.</span>",
  );
} else {
  tableCaption.insertAdjacentHTML(
    "beforeend",
    `<br><span>${getPlannedMealCount()} meals planned.</span>`,
  );
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const meals = ["Breakfast", "Lunch", "Dinner"];

const headerTitles = ["Day", ...meals];
headerTitles.forEach((title, index) => {
  const th = document.createElement("th");
  if (index === 0) {
    th.classList.add("day-header");
    th.textContent = title;
  } else {
    th.classList.add("meal-header");
    th.setAttribute("data-meal-type", title);
    th.insertAdjacentHTML(
      "beforeend",
      `<span class="meal-label">${title}</span>
      <button class="btn-link clear-meal float-right"
              title="${getPlannedMealCount(null, title) === 0 ? "No meals to clear" : `Clear all ${title} meals`}"
              data-meal-type='${title}'
              ${getPlannedMealCount(null, title) === 0 ? "disabled" : ""}
              >
                &times;
      </button>`,
    );
  }

  daysRow.appendChild(th);
});

days.forEach((day, dayIndex) => {
  const tr = document.createElement("tr");
  const dayCell = document.createElement("td");
  dayCell.classList.add("day-cell");
  dayCell.insertAdjacentHTML(
    "beforeend",
    `<span class="day-label">${day}</span>
    <button class="btn-link clear-day float-right"
            title='${getPlannedMealCount(day) === 0 ? "No meals to clear" : `Clear all meals for ${day}`}' 
            data-day-index='${dayIndex}'
            ${getPlannedMealCount(day) === 0 ? "disabled" : ""}>
              &times;
    </button>`,
  );
  tr.appendChild(dayCell);
  meals.forEach((mealType) => {
    const td = document.createElement("td");
    td.classList.add("planner-cell");
    td.setAttribute("data-meal-type", mealType);
    td.setAttribute("data-day-index", dayIndex);
    const meal = plannerMeals[day] ? plannerMeals[day][mealType] : null;
    if (meal) {
      td.innerHTML = `
        <div class="meal-info" title="${meal.strMeal}" data-meal-id="recipe-${meal.idMeal}">
          <span class="meal-name">
          <a href="recipe.html?id=${meal.idMeal}">${meal.strMeal}</a>
          <button class="btn-link remove-meal float-right" title='Remove recipe from the planner'>&times;</button>
          </span>
        </div>
      `;
    } else {
      td.innerHTML = `<span class="no-meal">-</span>`;
    }
    tr.appendChild(td);
  });
  tableBody.appendChild(tr);
});

document.querySelectorAll(".remove-meal").forEach((button) => {
  button.addEventListener("click", (e) => {
    const mealInfoDiv = e.target.closest(".meal-info");
    const mealId = mealInfoDiv
      .getAttribute("data-meal-id")
      .replace("recipe-", "");
    const mealName = mealInfoDiv.querySelector(".meal-name a").textContent;
    const td = e.target.closest("td");
    const dayIndex = td.getAttribute("data-day-index");
    const mealType = td.getAttribute("data-meal-type");
    const dayName = days[dayIndex];
    if (confirm(`Remove "${mealName}" from ${mealType} on ${dayName}?`)) {
      removePlannerMeal(dayName, mealType);
      td.innerHTML = `<span class="no-meal">-</span>`;
      // Update meal count in caption
      tableCaption.querySelector("span").textContent =
        `${getPlannedMealCount()} meals planned.`;
      alert(`"${mealName}" removed from ${mealType} on ${dayName}.`);
    }
  });
});

document.querySelectorAll(".clear-day").forEach((button) => {
  button.addEventListener("click", (e) => {
    const dayIndex = e.target.getAttribute("data-day-index");
    const dayName = days[dayIndex];
    if (confirm(`Clear all meals for ${dayName}?`)) {
      const tds = document.querySelectorAll(`td[data-day-index='${dayIndex}']`);
      tds.forEach((td) => {
        const mealType = td.getAttribute("data-meal-type");
        removePlannerMeal(dayName, mealType);
        td.innerHTML = `<span class="no-meal">-</span>`;
      });
      // Update meal count in caption
      tableCaption.querySelector("span").textContent =
        `${getPlannedMealCount()} meals planned.`;
      alert(`All meals for ${dayName} cleared.`);
      updateClearButtons();
    }
  });
});

document.querySelectorAll(".clear-meal").forEach((button) => {
  button.addEventListener("click", (e) => {
    const mealType = e.target.getAttribute("data-meal-type");
    if (confirm(`Clear all ${mealType} meals?`)) {
      const tds = document.querySelectorAll(`td[data-meal-type='${mealType}']`);
      tds.forEach((td) => {
        const dayIndex = td.getAttribute("data-day-index");
        const dayName = days[dayIndex];
        removePlannerMeal(dayName, mealType);
        td.innerHTML = `<span class="no-meal">-</span>`;
      });
      // Update meal count in caption
      tableCaption.querySelector("span").textContent =
        `${getPlannedMealCount()} meals planned.`;
      alert(`All ${mealType} meals cleared.`);

      updateClearButtons();
    }
  });
});

function updateClearButtons() {
  document.querySelectorAll(".clear-day").forEach((button) => {
    const dayIndex = button.getAttribute("data-day-index");
    const dayName = days[dayIndex];
    if (getPlannedMealCount(dayName) === 0) {
      button.disabled = true;
      button.title = "No meals to clear";
    }
  });
  document.querySelectorAll(".clear-meal").forEach((button) => {
    const mealType = button.getAttribute("data-meal-type");
    if (getPlannedMealCount(null, mealType) === 0) {
      button.disabled = true;
      button.title = `No meals to clear`;
    }
  });
}
