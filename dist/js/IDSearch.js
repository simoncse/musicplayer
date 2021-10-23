import { validVideoId, dispatchIDChangedEvent } from "./helper.js";
import { Settings } from "./Settings.js";
import UI from "./UI.js";

class IDSearch {
  /**
   * Initialises the instant search bar. Retrieves and creates elements.
   *
   * @param {HTMLElement} form       A form to submit to trigger successful result or error
   * @param {InstantSearchOptions} options A list of options for configuration
   */

  constructor(form, options) {
    this.form = form;
    this.options = options;
  }
  /**
   * Adds event listeners for elements of the ID search.
   */
  addListeners() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.isSelected()) return;

      const input = this.form.querySelector("input").value;

      const id = this.convertToId(input);

      validVideoId(id, (result) => {
        if (!result) {
          console.log("invalid video id ", id);
          UI.showModal("<p>Incorrect URL or video ID</p>");
          return;
        } else {
          console.log("valid video id ", id);
          dispatchIDChangedEvent({ videoId: id });
        }
      });
    });
  }

  isSelected() {
    return Settings.currentSearchMethod() === "IDSearch";
  }

  convertToId(input) {
    let id;
    const onlyId = /^[\S]{11}$/;
    const URL_REGEX =
      /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (input.match(URL_REGEX)) {
      id = input.match(URL_REGEX)[1];
    } else if (input.match(onlyId)) {
      id = input;
    } else {
      UI.showModal("<p>Incorrect URL or video ID</p>");
    }
    return id;
  }
}

export default IDSearch;
