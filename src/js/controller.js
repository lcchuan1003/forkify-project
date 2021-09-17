import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// model is the entire 'thing' imported from model.js
// of which the state object contains the recipe data

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //guard if id is invalid or there is no id

    // fetching recipe
    recipeView.loadingSpinner();

    // update results view to mark selected result
    resultsView.update(model.SearchResultsPage());

    // model imported from model.js
    await model.loadRecipe(id);
    // does not need  a variable because we're not returning anything
    // the loadRecipe in model.js stoed the data to model.state
    // console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(`Error caught at controller: ${err}`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load seach results
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results);
    // rendering all the results wihtout pagination

    resultsView.render(model.SearchResultsPage());

    // rendering paginated results
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagniation = function (goTo) {
  // render new results (change page)
  resultsView.render(model.SearchResultsPage(goTo));
  // update pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe serving size
  model.updateServings(newServings);
  // render the new recipe view
  // recipeView.render(model.state.recipe);
  // updating the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // load spinner
    addRecipeView.loadingSpinner();

    await model.uploadRecipe(newRecipe);
    console.log('Added new recipe', model.state.recipe);

    // rendering the newly uploaded recipe
    recipeView.render(model.state.recipe);

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // change ID in the windows URL
    // using built-in API: history
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close window and overlay
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  model.loadBookmarks();
  bookmarksView.render(model.state.bookmarks);

  recipeView._clear();
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagniation);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
