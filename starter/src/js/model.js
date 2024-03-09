import { API_URL } from './config';
import { AJAX } from './helpers';
import recipeView from './views/recipeView';
import { RES_PER_PAGE } from './config';
import { AJAX } from './helpers';
import { KEY } from './config';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookMarks: [],
};

const createRecipeObject = function (data) {
  console.log(data);
  console.log(data.data.recipe.id);
  const { recipe } = data.data;
  return {
    img: recipe.image_url,
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);
    console.log(data);

    if (state.bookMarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
  state.search.query = query;
  // console.log(data);
  state.search.results = data.data.recipes.map(recipe => {
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    };
  });
  state.search.page = 1;
};
export const getSearchResult = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * state.search.resPerPage;
  const end = page * state.search.resPerPage;
  console.log(start, end);

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookMarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
};

export const deleteBookMark = function (id) {
  const index = state.bookMarks.findIndex(bookmark => bookmark.id === id);
  state.bookMarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = await createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
