import View from './view.js';
import icons from 'url:../../img/icons.svg';
import preview from './preview.js';

class ResultsView extends View {
  _parentElement = document.querySelector(`.results`);
  _errorMessage = `No recipes found for your query! Please try again!`;
  _messageSuccess = ``;

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => preview.render(result, false)).join(``);
  }
}
export default new ResultsView();
