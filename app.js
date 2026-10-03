const recipes = [
  { id: "lemon-chicken", name: "Lemon herb chicken", time: 30, tags: ["gluten-free"], allergens: [], ingredients: ["chicken", "lemon", "rosemary", "potatoes"] },
  { id: "tomato-pasta", name: "Roasted tomato pasta", time: 25, tags: ["vegetarian"], allergens: ["gluten"], ingredients: ["pasta", "tomatoes", "basil", "parmesan"] },
  { id: "coconut-curry", name: "Coconut chickpea curry", time: 35, tags: ["vegan", "gluten-free"], allergens: [], ingredients: ["chickpeas", "coconut milk", "spinach", "rice"] },
  { id: "sesame-salmon", name: "Sesame ginger salmon", time: 25, tags: ["gluten-free"], allergens: ["fish", "sesame", "soy"], ingredients: ["salmon", "sesame", "ginger", "rice"] },
  { id: "mushroom-risotto", name: "Creamy mushroom risotto", time: 40, tags: ["vegetarian"], allergens: ["dairy"], ingredients: ["arborio rice", "mushrooms", "parmesan", "butter"] },
  { id: "bean-tacos", name: "Smoky black bean tacos", time: 25, tags: ["vegan"], allergens: ["gluten"], ingredients: ["black beans", "corn tortillas", "avocado", "lime"] },
  { id: "stuffed-peppers", name: "Garden veggie peppers", time: 40, tags: ["vegetarian", "gluten-free"], allergens: ["dairy"], ingredients: ["bell peppers", "rice", "tomatoes", "feta"] },
  { id: "chicken-bowl", name: "Ginger chicken rice bowl", time: 30, tags: ["gluten-free"], allergens: ["soy"], ingredients: ["chicken", "rice", "ginger", "broccoli"] },
  { id: "lentil-soup", name: "Cozy red lentil soup", time: 35, tags: ["vegan", "gluten-free"], allergens: [], ingredients: ["red lentils", "carrots", "tomatoes", "cumin"] },
  { id: "shrimp-noodles", name: "Chili lime shrimp noodles", time: 20, tags: [], allergens: ["shellfish", "gluten", "soy"], ingredients: ["shrimp", "noodles", "lime", "chili"] },
  { id: "falafel-bowl", name: "Crispy falafel bowls", time: 35, tags: ["vegan"], allergens: ["sesame"], ingredients: ["chickpeas", "tahini", "cucumber", "pita"] },
  { id: "roast-vegetables", name: "Harvest veggie tray bake", time: 35, tags: ["vegan", "gluten-free"], allergens: [], ingredients: ["sweet potato", "cauliflower", "chickpeas", "herbs"] },
  { id: "pesto-gnocchi", name: "Green pesto gnocchi", time: 20, tags: ["vegetarian"], allergens: ["tree nuts", "dairy", "gluten"], ingredients: ["gnocchi", "basil pesto", "pine nuts", "parmesan"] },
  { id: "beef-meatballs", name: "Sunday tomato meatballs", time: 40, tags: [], allergens: ["eggs", "gluten", "dairy"], ingredients: ["beef", "tomatoes", "breadcrumbs", "parmesan"] },
  { id: "peanut-noodles", name: "Peanut crunch noodles", time: 20, tags: ["vegan"], allergens: ["peanuts", "soy", "gluten"], ingredients: ["noodles", "peanut butter", "carrots", "lime"] },
  { id: "frittata", name: "Spinach and feta frittata", time: 25, tags: ["vegetarian", "gluten-free"], allergens: ["eggs", "dairy"], ingredients: ["eggs", "spinach", "feta", "potatoes"] }
];

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const allergyInputs = [...document.querySelectorAll(".allergy-option input")];
const weekGrid = document.querySelector("#week-grid");
const toast = document.querySelector("#toast");
const recipeDialog = document.querySelector("#recipe-dialog");
const recipeList = document.querySelector("#recipe-list");
const storageKeys = { allergies: "gather-allergies", plan: "gather-plan" };
let selectedAllergies = loadArray(storageKeys.allergies);
let plan = loadArray(storageKeys.plan);
let toastTimer;

function loadArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn(`Could not read saved ${key} from local storage.`, error);
    return [];
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key} to local storage.`, error);
    showToast("Your browser couldn’t save this change.");
  }
}

function getSafeRecipes() {
  return recipes.filter((recipe) => !recipe.allergens.some((allergen) => selectedAllergies.includes(allergen)));
}

function dateForWeekday(weekdayIndex) {
  const date = new Date();
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset + weekdayIndex);
  return date;
}

function updateWeekLabel() {
  const monday = dateForWeekday(0);
  const sunday = dateForWeekday(6);
  const month = new Intl.DateTimeFormat("en", { month: "short" });
  const fromMonth = month.format(monday);
  const toMonth = month.format(sunday);
  document.querySelector("#week-label").textContent = fromMonth === toMonth
    ? `${fromMonth} ${monday.getDate()} – ${sunday.getDate()}`
    : `${fromMonth} ${monday.getDate()} – ${toMonth} ${sunday.getDate()}`;
}

function renderPlan() {
  const safeRecipes = getSafeRecipes();
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;
  weekGrid.innerHTML = dayNames.map((day, index) => {
    const date = dateForWeekday(index);
    const recipe = recipes.find((item) => item.id === plan[index] && safeRecipes.includes(item));
    const cardClass = index === todayIndex ? "day-card today" : "day-card";
    const meal = recipe
      ? `<div class="meal-type">Dinner</div>
         <p class="meal-title">${recipe.name}</p>
         <div class="meal-meta"><span>${recipe.time} min</span><span class="meta-dot"></span><span>${recipe.tags[0] || "easy"}</span></div>
         <button class="swap-button" type="button" data-swap="${index}" aria-label="Swap ${recipe.name} for another dinner">↻ Swap idea</button>`
      : `<div class="empty-meal"><div><span>＋</span><button type="button" data-swap="${index}">Add a dinner</button></div></div>`;
    return `<article class="${cardClass}">
      <div class="day-head"><span class="day-name">${day.slice(0, 3)}</span><span class="day-date">${date.getDate()}</span></div>
      ${meal}
    </article>`;
  }).join("");

  const plannedCount = plan.filter((id) => safeRecipes.some((recipe) => recipe.id === id)).length;
  document.querySelector("#plan-summary-text").textContent = plannedCount
    ? `${plannedCount} of 7 dinners planned · all suggestions match your food profile`
    : "A little inspiration for your week.";
  document.querySelector("#recipe-count").textContent = safeRecipes.length;
  updateSafetyMessage();
  renderRecipeBox();
}

function renderRecipeBox() {
  recipeList.innerHTML = getSafeRecipes().map((recipe) => {
    const dayOptions = dayNames.map((day, index) =>
      `<option value="${index}">${day}${plan[index] ? " · replace planned dinner" : ""}</option>`
    ).join("");
    return `<article class="recipe-item">
      <div class="recipe-item-copy">
        <h3>${recipe.name}</h3>
        <p>${recipe.ingredients.join(" · ")}</p>
        <span>${recipe.time} min · ${recipe.tags.join(", ") || "easy"}</span>
      </div>
      <div class="recipe-item-action">
        <label class="sr-only" for="recipe-day-${recipe.id}">Choose a day for ${recipe.name}</label>
        <select id="recipe-day-${recipe.id}" data-recipe-day="${recipe.id}">${dayOptions}</select>
        <button class="button button-primary" type="button" data-add-recipe="${recipe.id}">Add</button>
      </div>
    </article>`;
  }).join("");
}

function updateSafetyMessage() {
  const title = document.querySelector("#safety-title");
  const copy = document.querySelector("#safety-copy");
  const count = document.querySelector("#allergy-count");
  if (selectedAllergies.length) {
    title.textContent = `Looking out for ${selectedAllergies.length} ${selectedAllergies.length === 1 ? "allergy" : "allergies"}`;
    copy.textContent = `${selectedAllergies.map(capitalize).join(", ")} ${selectedAllergies.length === 1 ? "is" : "are"} excluded from every recipe suggestion.`;
    count.textContent = `${selectedAllergies.length} ${selectedAllergies.length === 1 ? "allergy" : "allergies"} selected`;
  } else {
    title.textContent = "Your table, your rules";
    copy.textContent = "Set your roommate’s allergies and we’ll keep them out of every suggestion.";
    count.textContent = "No allergies selected";
  }
}

function capitalize(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function makePlan() {
  const safeRecipes = getSafeRecipes();
  if (!safeRecipes.length) {
    showToast("No recipes match those allergies yet. Try adjusting the profile.");
    return;
  }

  const shuffled = [...safeRecipes].sort(() => Math.random() - 0.5);
  plan = Array.from({ length: 7 }, (_, index) => shuffled[index % shuffled.length].id);
  save(storageKeys.plan, plan);
  renderPlan();
  showToast("A fresh, allergy-aware week is ready.");
}

function swapRecipe(dayIndex) {
  const safeRecipes = getSafeRecipes();
  const currentId = plan[dayIndex];
  const otherPlanned = new Set(plan.filter((id, index) => index !== dayIndex));
  const candidates = safeRecipes.filter((recipe) => recipe.id !== currentId && !otherPlanned.has(recipe.id));
  if (!candidates.length) {
    showToast("No different dinner ideas left for this week.");
    return;
  }
  plan[dayIndex] = candidates[Math.floor(Math.random() * candidates.length)].id;
  save(storageKeys.plan, plan);
  renderPlan();
  showToast("Dinner idea swapped.");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

allergyInputs.forEach((input) => {
  input.checked = selectedAllergies.includes(input.value);
  input.addEventListener("change", () => {
    selectedAllergies = allergyInputs.filter((item) => item.checked).map((item) => item.value);
    save(storageKeys.allergies, selectedAllergies);
    const safeIds = new Set(getSafeRecipes().map((recipe) => recipe.id));
    plan = plan.map((id) => safeIds.has(id) ? id : null);
    save(storageKeys.plan, plan);
    renderPlan();
  });
});

document.querySelector("#generate-plan").addEventListener("click", makePlan);
document.querySelector("#clear-plan").addEventListener("click", () => {
  plan = Array(7).fill(null);
  save(storageKeys.plan, plan);
  renderPlan();
  showToast("Your week is clear and ready for new ideas.");
});
document.querySelector("#today-button").addEventListener("click", () => {
  window.location.hash = "planner";
  document.querySelector("#planner").scrollIntoView({ behavior: "smooth" });
});
weekGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-swap]");
  if (button) swapRecipe(Number(button.dataset.swap));
});
document.querySelector("#browse-recipes").addEventListener("click", () => {
  renderRecipeBox();
  recipeDialog.showModal();
});
document.querySelector("#close-recipes").addEventListener("click", () => recipeDialog.close());
recipeList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-recipe]");
  if (!button) return;

  const recipeId = button.dataset.addRecipe;
  const select = recipeList.querySelector(`[data-recipe-day="${recipeId}"]`);
  const dayIndex = Number(select.value);
  plan[dayIndex] = recipeId;
  save(storageKeys.plan, plan);
  renderPlan();
  recipeDialog.close();
  showToast(`${recipes.find((recipe) => recipe.id === recipeId).name} added to ${dayNames[dayIndex]}.`);
});

function updateActiveNav() {
  const currentHash = window.location.hash || "#planner";
  document.querySelectorAll(".nav-item").forEach((link) => {
    const isActive = link.getAttribute("href") === currentHash;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("hashchange", updateActiveNav);
document.querySelectorAll(".nav-item, .profile-mini, .banner-link").forEach((link) => {
  link.addEventListener("click", () => window.setTimeout(updateActiveNav, 0));
});

if (plan.length !== 7) plan = Array(7).fill(null);
updateWeekLabel();
renderPlan();
updateActiveNav();