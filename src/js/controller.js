// Model
import * as model from './model.js';
//Views
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { CLOSE_FROM_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

// Recipe application logic
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();
    // 0. Update results view to mark selected serch results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //  1.Loading Recipe
    await model.loadRecipe(id);

    // 2. Rendring Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

// Search bar application logic
const controlSearchResults = async function () {
  try {
    // 1. Get Search Query & clear input
    const query = searchView.getQuery();
    if (!query) return;
    // Render Spinner
    resultsView.renderSpinner();

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render Pagination Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};
controlSearchResults();

const controlPegination = function (goToPage) {
  // 3. Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. Render Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (inn state)
  model.updateSevings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  // Update Recipe View
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    // Add spinner
    recipeView.renderSpinner();

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render Message

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in the URL(history API)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    addRecipeView.renderMessage();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload();
    }, CLOSE_FROM_SEC * 1000);
  } catch (error) {
    console.error(`******${error}`);
    addRecipeView.renderError(error.message);
  }
};

// Publisher - subscriber for events
const init = function () {
  bookmarksView.addHandlerRenderBookmarks(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPegination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
