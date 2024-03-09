import View from './View';
import icons from '../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again;)';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(res => this._previewMarkup(res)).join('');
  }

  _previewMarkup(result) {
    return `<li class="preview">
    <a class="preview__link preview__link--active" href="#${result.id}">
      <figure class="preview__fig">
        <img src="${result.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${result.title}</h4>
        <p class="preview__publisher">${result.publisher}</p>
        
      </div>
    </a>
  </li>`;
  }
}

export default new ResultView();
