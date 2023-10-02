import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './View/recipeView.js';
import searchView from './View/searchView.js';
import resultsView from './View/resultsView.js';
import paginationView from './View/paginationView.js';
import bookmarksView from './View/bookmarksView.js';
import addRecipeView from './View/addRecipeView.js';
import { add } from 'lodash-es';

const controlRecipe = async function () {
  try {
    bookmarksView.renderData(model.state.bookmarks);
    //loadRecipe
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    const page = 1;

    resultsView.updateData(model.loadPerPageResults(page));

    //const id = '5ed6604591c37cdc054bc886';
    await model.loadRecipe(id);

    //get recipe details

    recipeView.renderData(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError(err);
  }
};

const controlSearch = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    const page = 1;
    resultsView.renderData(model.loadPerPageResults(page));
    paginationView.renderData(model.state.search.results);
    paginationView.renderPageData(page);
    recipeView.addRecipeHandler(controlRecipe);
  } catch (err) {
    console.log(err);
    resultsView.renderError(err);
  }
};

const controlPagination = function (page) {
  resultsView.renderData(model.loadPerPageResults(page));
  paginationView.renderPageData(page);
};

const controlUpdateRecipe = function (servings) {
  model.loadUpdateRecipe(servings);
  recipeView.updateData(model.state.recipe);
};
const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  bookmarksView.renderData(model.state.bookmarks);
  recipeView.updateData(model.state.recipe);
};

const controlUploadRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.renderData(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.renderData(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    location.reload();
  }
};

/* const controlshowBookmarks = function () {
  bookmarksView.renderData(model.state.bookmarks);
}; */

const init = function () {
  // bookmarksView.addBookmarksViewHandler(controlshowBookmarks);
  searchView.addSearchHandler(controlSearch);
  recipeView.addRecipeHandler(controlRecipe);
  paginationView.addPaginationHandler(controlPagination);
  recipeView.addUpdateRecipeHandler(controlUpdateRecipe);
  recipeView.addBookmarkHandler(controlBookmark);
  addRecipeView.addUploadHandler(controlUploadRecipe);
};

init();
