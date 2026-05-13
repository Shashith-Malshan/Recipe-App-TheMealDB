# MealMate (Recipe App - TheMealDB)

MealMate is a simple frontend recipe web app built with HTML, CSS, and JavaScript using [TheMealDB](https://www.themealdb.com/) API.

## Features

- Search meals by name
- Discover a random meal
- Browse meals by:
  - Category
  - Area
  - Ingredient
- View detailed recipe information:
  - Meal image
  - Ingredients and measures
  - Instructions
  - Area and tags

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- AOS (Animate On Scroll)

## Project Structure

```text
.
├── index.html
├── recipe.html
└── assets
    ├── css
    │   └── style.css
    ├── images
    └── js
        ├── app.js
        └── ani.js
```

## How to Run

This is a static project and does not require a build step.

1. Clone or download the repository.
2. Open `index.html` in your browser.

For better behavior with browser security policies, run with a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## API Usage

The app consumes TheMealDB API endpoints including:

- `random.php`
- `filter.php` (category, area, ingredient)
- `list.php` (category, area, ingredient lists)
- `lookup.php` (meal by ID)
- `search.php` (meal by name)

## Notes

- Selected or searched meals are passed between pages using `localStorage`.
