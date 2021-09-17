import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goTo = +btn.dataset.goto;

      handler(goTo);
    });
  }
  _generateMarkup() {
    // calculating number of pages from the data
    const numPages = Math.ceil(this._data.results.length / this._data.perPage);

    let curPage = this._data.page;
    const nextButton = `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
        </button>`;
    const prevButton = `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>`;

    const resultInfo = `
        <p>Showing ${1 + this._data.perPage * (curPage - 1)} to ${
      this._data.perPage * curPage
    } of ${this._data.results.length} results<br>
        Page ${curPage} of ${numPages}
        </p>`;
    //A.on pg1, shows next
    if (curPage === 1 && numPages > 1)
      return `
        ${resultInfo}
        ${nextButton}`;

    // B.on pg1, no next pg
    if (curPage === 1 && numPages === 1)
      return `
        ${resultInfo}`;

    // C. on between, shows next + prev
    if (curPage < numPages)
      return `
        ${prevButton}
        ${resultInfo}
        ${nextButton}`;

    // D. on last page, shows prev
    if (curPage === numPages && numPages > 1)
      return `
        ${prevButton}
        <p>Showing ${1 + this._data.perPage * (curPage - 1)} to ${
        this._data.results.length
      } of ${this._data.results.length} recipes<br>
          Page ${curPage} of ${numPages}
        </p>`;
  }
}

export default new PaginationView();
