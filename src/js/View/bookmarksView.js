import icons from '../../img/icons.svg';
import view from './view.js';
import previewView from './previewView.js';

class bookmarksView extends view {
  _parentElement = document.querySelector('.bookmarks');
  _message = '';
  _errorMessage = 'No recipes found for your query! Please try again ;)';

  /* addBookmarksViewHandler(handler) {
    window.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  } */

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.renderData(bookmark, false))
      .join('');
  }
}

export default new bookmarksView();
