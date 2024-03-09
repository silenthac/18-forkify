// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
const recipeContainer = document.querySelector('.recipe');
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);

    // console.log(data);
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // resultsView.renderSpinner();

    //1) Get Search Query
    const query = searchView.getQuery();
    console.log(query);
    if (!query || query == '') return;
    resultsView.renderSpinner();
    //2)Load search result
    await model.loadSearchResult(query);

    resultsView.render(model.getSearchResult());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const constrolPagination = function (goToPage) {
  resultsView.render(model.getSearchResult(goToPage));

  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // console.log('new servings:', newServings);
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  console.log(model.state.recipe);

  bookmarkView.render(model.state.bookMarks);
};

// showRecipe();
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.rendermessage();
    bookmarkView.render(model.state.bookMarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1.5 * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(constrolPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarkView.addHandlerUpload(controlAddRecipe);
};

init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
