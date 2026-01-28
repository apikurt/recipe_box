const daysRow = document.querySelector(".days-row");
const tableBody = document.querySelector("table tbody");
const tableCaption = document.querySelector("table caption");

const plannerMeals = getPlannerMeals();

if (plannerMeals && Object.keys(plannerMeals).length === 0) {
  tableCaption.insertAdjacentHTML(
    "beforeend",
    "<br><span>No meals planned yet.</span>",
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
headerTitles.forEach((title) => {
  const th = document.createElement("th");
  th.textContent = title;
  daysRow.appendChild(th);
});

days.forEach((day, dayIndex) => {
  const tr = document.createElement("tr");
  const dayCell = document.createElement("td");
  dayCell.textContent = day;
  tr.appendChild(dayCell);
  meals.forEach((mealType) => {
    const td = document.createElement("td");
    td.classList.add("planner-cell");
    td.setAttribute("data-meal-type", mealType);
    td.setAttribute("data-day-index", dayIndex);
    const meal = plannerMeals[day] ? plannerMeals[day][mealType] : null;
    if (meal) {
      td.innerHTML = `
        <div class="meal-info">
          <span class="meal-name">
          <a href="recipe.html?id=${meal.idMeal}">${meal.strMeal}</a>
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
