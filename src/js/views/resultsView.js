import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMsg = 'Could not find recipe, please try something else!';
  _successmsg;

  _generateMarkup() {
    return this._data.map(this._bookmarkTemplate).join('');
  }

  _bookmarkTemplate(result) {
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${
          result.id === id ? 'preview__link--active' : ''
        }" href="#${result.id}">
          <figure class="preview__fig" >
            <img src="${result.image_url}" alt="recipe preview" crossorigin/>
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>`;
  }
}

export default new ResultsView();
