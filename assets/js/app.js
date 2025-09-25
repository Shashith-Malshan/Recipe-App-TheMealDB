const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            localStorage.setItem('searchedMeal', query);
            window.location.href = 'recipe.html';
        }
    });
}

if (document.querySelector('.lRecipe')) {

    const categoryDropdown = document.getElementById('categoryDropdown');
    const areaDropdown = document.getElementById('areaDropdown');
    const ingredientsDropdown = document.getElementById('ingredientsDropdown');

    const popularCardImage = document.querySelector('.popular-img img');
    const popularCardTitle = document.querySelector('.popular-text h2');
    const getRecipeBtn = document.querySelector('.get-btn');

    const discoverSection = document.querySelector('.discover-section');
    const discoverCards = document.querySelectorAll('.discover-section .recipe-card');
    const discoverTitle = document.querySelector('.discover-section h2');

    const scrollToDiscover = () => {
        discoverSection.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Discover Random Meal ---
    if (getRecipeBtn) {
        async function loadRandomMeal() {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await res.json();
            const meal = data.meals[0];

            popularCardImage.src = meal.strMealThumb;
            popularCardTitle.textContent = meal.strMeal;
            popularCardTitle.dataset.tags = meal.strTags || '';
            popularCardTitle.dataset.area = meal.strArea || '';

            getRecipeBtn.onclick = (e) => {
                e.preventDefault();
                localStorage.setItem('mealId', meal.idMeal);
                window.location.href = 'recipe.html';
            };
        }

        loadRandomMeal();
    }
    const loadDefaultCategory = async () => {
        const defaultCategory = "Miscellaneous";
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${defaultCategory}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        const meals = data.meals || [];

        if (discoverCards.length === 0) return;

        discoverTitle.textContent = `Category - ${defaultCategory}`;

        discoverCards.forEach((card, index) => {
            if (meals[index]) {
                card.style.display = 'block';
                card.querySelector('.card-img').src = meals[index].strMealThumb;
                card.querySelector('.card-img').alt = meals[index].strMeal;
                card.querySelector('h5').textContent = meals[index].strMeal;

                card.onclick = () => {
                    localStorage.setItem('mealId', meals[index].idMeal);
                    window.location.href = 'recipe.html';
                };
            } else {
                card.style.display = 'none';
            }
        });
    };

    setTimeout(loadDefaultCategory, 100);

    const populateDropdown = async (url, dropdown) => {
        const res = await fetch(url);
        const data = await res.json();
        const list = Object.values(data)[0];
        dropdown.querySelector('.dropdown-menu').innerHTML = '';

        list.forEach(item => {
            const value = item.strCategory || item.strArea || item.strIngredient;
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="#">${value}</a>`;
            dropdown.querySelector('.dropdown-menu').appendChild(li);

            li.addEventListener('click', async (e) => {
                e.preventDefault();
                const type = dropdown.id.includes('category') ? 'Category' :
                             dropdown.id.includes('area') ? 'Area' : 'Ingredients';

                const apiUrl = type === 'Category' ? 
                    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}` :
                    type === 'Area' ? 
                    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}` :
                    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${value}`;

                const res2 = await fetch(apiUrl);
                const data2 = await res2.json();
                const meals = data2.meals || [];

                discoverTitle.textContent = `${type} - ${value}`;

                discoverCards.forEach((card, index) => {
                    if (meals[index]) {
                        card.style.display = 'block';
                        card.querySelector('.card-img').src = meals[index].strMealThumb;
                        card.querySelector('.card-img').alt = meals[index].strMeal;
                        card.querySelector('h5').textContent = meals[index].strMeal;

                        card.onclick = () => {
                            localStorage.setItem('mealId', meals[index].idMeal);
                            window.location.href = 'recipe.html';
                        };
                    } else {
                        card.style.display = 'none';
                    }
                });

                scrollToDiscover();
            });
        });
    };

    populateDropdown('https://www.themealdb.com/api/json/v1/1/list.php?c=list', categoryDropdown);
    populateDropdown('https://www.themealdb.com/api/json/v1/1/list.php?a=list', areaDropdown);
    populateDropdown('https://www.themealdb.com/api/json/v1/1/list.php?i=list', ingredientsDropdown);
}

if (document.getElementById('recipeCard')) {

    const mealId = localStorage.getItem('mealId');
    const searchedMeal = localStorage.getItem('searchedMeal');

    const mealTitleEl = document.getElementById('mealTitle');
    const mealImageEl = document.getElementById('mealImage');
    const mealIngredientsEl = document.getElementById('mealIngredients');
    const mealInstructionsEl = document.getElementById('mealInstructions');
    const mealAreaTagsEl = document.getElementById('mealAreaTags');

    const loadMeal = async (idOrName, byId = true) => {
        const url = byId ? 
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idOrName}` :
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${idOrName}`;
        const res = await fetch(url);
        const data = await res.json();
        const meal = data.meals ? data.meals[0] : null;
        if (!meal) return;

        mealTitleEl.textContent = meal.strMeal;
        mealImageEl.src = meal.strMealThumb;
        mealImageEl.alt = meal.strMeal;

        mealAreaTagsEl.textContent = `Area: ${meal.strArea || 'N/A'} | Tags: ${meal.strTags || 'N/A'}`;

        // Ingredients
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim()) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            }
        }
        mealIngredientsEl.innerHTML = '';
        ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.textContent = ing;
            mealIngredientsEl.appendChild(li);
        });

        // Instructions
        const steps = meal.strInstructions.split(/\r?\n/).filter(step => step.trim() !== '');
        mealInstructionsEl.innerHTML = '';
        steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            mealInstructionsEl.appendChild(li);
        });
    };

    if (mealId) {
        loadMeal(mealId);
        localStorage.removeItem('mealId');
    } else if (searchedMeal) {
        loadMeal(searchedMeal, false);
        localStorage.removeItem('searchedMeal');
    } else {
        document.getElementById('recipeCard').innerHTML =
            '<p class="text-center text-danger">No meal selected.</p>';
    }
}


