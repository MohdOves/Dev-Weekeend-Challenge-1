# Gather — Good food, shared

My submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).

## What I Built

Gather is a responsive meal planner made for a friend sharing a kitchen with a roommate who has food allergies. It helps make planning dinner together easier and more thoughtful.

Choose the roommate’s allergies and Gather filters out recipes marked with those allergens. Generate a week of dinner ideas, swap a meal, browse the allergy-aware recipe box, and add a recipe to a chosen day. The allergy profile and weekly plan are saved in the browser, so they’re still there when you come back.

Recipes are sample suggestions, not medical advice. Always check ingredient labels and cross-contamination risks, especially when cooking for someone with an allergy.

## Demo

**Live demo:** [gather-meal-planner.onrender.com](https://gather-meal-planner.onrender.com/)



## Code

**GitHub repository:** [MohdOves/Dev-Weekeend-Challenge-1](https://github.com/MohdOves/Dev-Weekeend-Challenge-1)

The app is built with vanilla HTML, CSS, and JavaScript. It has no build step or runtime service dependency.

## How I Built It

I built Gather with HTML, CSS, and plain JavaScript. The interface adapts to mobile and desktop screens, and browser `localStorage` keeps the food profile and meal plan between visits.

I used GitHub Copilot in VS Code as an AI coding assistant while building the project. The app itself does not call an AI model or an external AI API: its recipe suggestions are selected from a small, built-in collection and filtered against each recipe’s listed allergens. I did not use an open-weight model in the app.

## Why Does Open Innovation Matter?

Food preferences and allergies are personal. Keeping the recipe list, allergen labels, and filtering logic visible in the code makes it easier for someone to review, adapt, and improve them for their own household. Because the app runs in the browser without a closed recipe or AI API, it can be tried and extended without an account, API key, or service subscription.

That simplicity also comes with a limitation: this is a small demo, not a verified medical or nutrition database. Open code makes it possible for others to inspect and contribute improvements, but recipe labels still need careful review before anyone relies on them.

## My Agent Session

<!-- Optional: add a DevRelay session link or embed your agent session here. -->

## Prize Categories

<!-- Add every partner category you are entering, or remove this section if none apply. -->
