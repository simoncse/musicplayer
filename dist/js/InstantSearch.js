import { Settings } from "./Settings.js";

class InstantSearch {
  /**
   * Initialises the instant search bar. Retrieves and creates elements.
   *
   * @param {HTMLElement} instantSearch The container element for the instant search
   * @param {InstantSearchOptions} options A list of options for configuration
   */

  constructor(instantSearch, options) {
    this.options = options;
    this.elements = {
      main: instantSearch,
      input: instantSearch.querySelector("input"),
      resultsContainer: document.createElement("div"),
    };

    this.elements.resultsContainer.classList.add("searchResults");
    // this.elements.resultsContainer.dataset.searchDropdown = "";
    this.elements.main.appendChild(this.elements.resultsContainer);

    console.log(this.elements.input);
  }

  /**
   * Adds event listeners for elements of the instant search.
   */
  addListeners() {
    let delay;
    this.elements.input.addEventListener("input", () => {
      if (!this.isSelected()) {
        console.log("you didn't choose this");
        return;
      }
      //   if (this.isSelected === false) return;

      clearTimeout(delay);
      console.log("you choose name search");
      const query = this.elements.input.value;
      delay = setTimeout(() => {
        if (query.length < 3) {
          this.populateResults([]);
          return;
        }
        this.performSearch(query).then((results) => {
          this.populateResults(results);
          this.elements.resultsContainer.style.display = "flex";
          this.elements.resultsContainer.classList.add("visible");
          // this.elements.resultsContainer.classList.add("visible");
        });
      }, 500);
    });
    this.elements.input.addEventListener("focus", () => {
      this.elements.resultsContainer.style.display = "flex";
      this.elements.resultsContainer.classList.add("visible");
      //the toggle will be completed in main js using event delegation (see toggleFocus());
    });
  }

  /**
   * Updates the HTML to display each result under the search bar.
   *
   * @param {Object[]} results
   */
  populateResults(results) {
    // Clear all existing results
    while (this.elements.resultsContainer.firstChild) {
      this.elements.resultsContainer.removeChild(
        this.elements.resultsContainer.firstChild
      );
    }
    // Update list of results under the search bar
    for (const result of results) {
      this.elements.resultsContainer.appendChild(
        this.createResultElement(result)
      );
      console.log("creating a result");
    }
  }

  /**
   * Creates the HTML to represents a single result in the list of results.
   *
   * @param {Object} result An instant search result
   * @returns {HTMLAnchorElement}
   */
  createResultElement(result) {
    const div = document.createElement("div");
    //add youtube id as data attribute to each div
    this.options.attachVideoID(div, result);
    div.classList.add("searchResult");
    div.insertAdjacentHTML("afterbegin", this.options.templateFunction(result));
    return div;
  }

  isSelected() {
    return Settings.currentSearchMethod() === "nameSearch";
  }

  /**
   * Makes a request at the search URL and retrieves results.
   *
   * @param {string} query Search query
   * @returns {Promise<Object[]>}
   */
  async performSearch(query) {
    try {
      const resData = await this.options.getResultsFromAPI(query);
      return this.options.responseParser(resData);
    } catch (err) {
      console.log("something went wrong");
      console.log(err);
    }
    // const url = new URL(this.options.searchUrl.toString());
    // const [part, q, type, maxResults, key] = this.options.queryParam;
    // url.searchParams.set(part, "snippet");
    // url.searchParams.set(q, query);
    // url.searchParams.set(type, "video");
    // url.searchParams.set(maxResults, 10);
    // url.searchParams.set(key, "AIzaSyDqQ6y7K_EL00uni9DF2j0alG9WG9Hoj8c");
    // console.log(url);
    // return fetch(url, {
    //   method: "get",
    // })
    //   .then((response) => {
    //     if (response.status !== 200) {
    //       throw new Error("Something went wrong with the search!");
    //     }
    //     return response.json();
    //   })
    //   .then((responseData) => {
    //     return this.options.responseParser(responseData);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     return [];
    //   });
  }
}

export default InstantSearch;
