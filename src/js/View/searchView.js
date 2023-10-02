import view from './view.js';

class searchView extends view {
  _parentElement = document.querySelector('.search__field');
  _query;

  getQuery() {
    this._query = document.querySelector('.search__field').value;
    document.querySelector('.search__field').value = '';
    return this._query;
  }

  /* renderData(data) {
    this._data = data;
    this._markup = this._generateMarkup(this._data);
    this._parentElement.insertAdjacentHTML('afterbegin', this._markup);
  } */

  addSearchHandler(handler) {
    document
      .querySelector('.search__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }
}

export default new searchView();
