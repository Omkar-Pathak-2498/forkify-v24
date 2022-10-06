import View from './view.js';
import icons from 'url:../../img/icons.svg';
import preview from './preview.js';
class BookmarksView extends View {
  _parentElement = document.querySelector(`.bookmarks__list`);
  _errorMessage = `No bookmarks yet.Find a nice recipe and bookmark it`;
  _messageSuccess = ``;

  addHandlerRenderBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(bookmark => preview.render(bookmark, false)).join(``);
  }
}
export default new BookmarksView();
