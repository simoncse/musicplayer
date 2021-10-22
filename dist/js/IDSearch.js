import { validVideoId, dispatchIDChangedEvent } from "./helper.js";
import { Settings } from "./Settings.js";

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

      validVideoId(input, (result) => {
        if (!result) {
          console.log("invalid video id ", input);
          return;
        } else {
          console.log("valid video id ", input);
          // Store.setCurrentSong(new Song({ id: this.query }));
          dispatchIDChangedEvent({ videoId: input });
        }
      });
    });
  }

  isSelected() {
    return Settings.currentSearchMethod() === "IDSearch";
  }
}

export default IDSearch;
