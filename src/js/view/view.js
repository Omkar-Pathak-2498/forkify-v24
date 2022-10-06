import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // Documentation
  /**
   *Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be render (e.g. recipe)
   * @param {boolean} [render = true] If false, create markup instead of rendering to the DOM
   * @returns
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const currentEl = currentElements[i];

      // Update changed TEXT

      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES

      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attribute =>
          currentEl.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = ``;
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
           <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
     <div class="error">
        <div>
          <svg>
           <use href="${icons}g#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
     </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderMessage(message = this._messageSuccess) {
    const markup = `
     <div class="message">
        <div>
          <svg>
           <use href="${icons}g#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
     </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
}
