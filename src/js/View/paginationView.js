import icons from '../../img/icons.svg';
import { RES_PER_PAGE } from './../config.js';
Fraction = require('fractional').Fraction;

class paginationView {
  _parentElement = document.querySelector('.pagination');
  _numpages;
  _currentPage = 1;
  _data;

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderData(data) {
    this._data = data;
    this._numpages = Math.ceil(data.length / `${RES_PER_PAGE}`);
  }

  renderPageData(page) {
    this._currentPage = page;
    this._clear();
    this._markup = this._generateMarkup(this._currentPage);
    this._parentElement.insertAdjacentHTML('afterbegin', this._markup);
  }

  addPaginationHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      this._currentPage = gotoPage;
      handler(gotoPage);
    });
  }

  _generateMarkup(page) {
    //only one page;

    if (this._numpages > 1 && page == 1) {
      return `
        <button data-goto = "${
          page + 1
        }"  class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }

    if (page > 1 && page < this._numpages)
      return `
        <button data-goto = "${
          page - 1
        }" class="btn--inline pagination__btn--prev " >
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span > Page ${page - 1}</span>
          </button>
          <button data-goto = "${
            page + 1
          }"  class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;

    if (page == this._numpages) {
      return `
        <button data-goto = "${
          page - 1
        }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>`;
    }

    if (this._numpages == page && page == 1) {
      return ` 
        `;
    }
  }
}

export default new paginationView();
