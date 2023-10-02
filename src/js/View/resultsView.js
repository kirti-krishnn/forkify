import icons from '../../img/icons.svg';
import view from './view.js';
import previewView from './previewView.js';

class resultsView extends view {
  _parentElement = document.querySelector('.results');
  _message = '';
  _errorMessage = 'No recipes found for your query! Please try again ;)';

  _generateMarkup() {
    return this._data.map(res => previewView.renderData(res, false)).join('');
  }
}

export default new resultsView();
