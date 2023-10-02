import { getJSON, sendJSON } from './handler.js';
import { API_URL } from './config';
import { KEY } from './config';
import { RES_PER_PAGE } from './config';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page_num: 1,
    page_start: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    cookingtime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  const getData = await getJSON(`${API_URL}/${id}?key=${KEY}`);

  state.recipe = createRecipeObject(getData);

  if (state.bookmarks.some(bookmark => id === bookmark.id))
    state.recipe.bookmarked = true;
  else state.recipe.bookmarked = false;
};

export const loadSearchResults = async function (query) {
  const url = `${API_URL}?search=${query}&key=${KEY}`;
  const getData = await getJSON(url);
  state.search.results = [];
  getData.data.recipes.forEach(recipe =>
    state.search.results.push({
      id: recipe.id,
      image: recipe.image_url,
      title: recipe.title,
      publisher: recipe.publisher,
      ...(recipe.key && { key: recipe.key }),
    })
  );
};

export const loadPerPageResults = function (pagenum) {
  const start = (pagenum - 1) * `${RES_PER_PAGE}`;
  const end = pagenum * `${RES_PER_PAGE}`;
  state.search.page_start = pagenum;
  return state.search.results.slice(start, end);
};

export const loadUpdateRecipe = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (+ing.quantity * servings) / state.recipe.servings;
  });
  state.recipe.servings = servings;
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    state.bookmarks.push(recipe);
  }
  persistBookmark();
};

export const deleteBookmark = function (id) {
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  persistBookmark();
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Please enter the data in correct format');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    console.log(newRecipe.cookingtime);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
