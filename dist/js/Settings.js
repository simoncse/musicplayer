import Store from "./Store.js";
import UI from "./UI.js";

class _Settings {
  constructor() {
    this._volume = Store.getSettings("volume");
    this._playCycle = Store.getSettings("playCycle");
    this._searchMethod = Store.getSettings("searchMethod");
    this._mute = Store.getSettings("mute");
  }

  currentPlayCycle() {
    return this._playCycle;
  }
  updatePlayCycle() {
    if (this._playCycle === "none") {
      this._playCycle = "once";
    } else if (this._playCycle === "once") {
      this._playCycle = "all";
    } else {
      this._playCycle = "none";
    }

    Store.setSettings({ playCycle: this._playCycle });
  }

  updateVolume(val) {
    this._volume = val;
    Store.setSettings({ volume: this._volume });
  }

  currentVolume() {
    return this._volume;
  }

  mute() {
    return this._mute;
  }

  toggleMute() {
    this._mute = !this._mute;
    Store.setSettings({ mute: this._mute });
  }

  currentSearchMethod() {
    return this._searchMethod;
  }

  updateSearchMethod(method) {
    this._searchMethod = method;
    Store.setSettings({ searchMethod: this._searchMethod });
  }

  renderToDOM() {
    UI.displaySearchMethod(this._searchMethod);
    UI.updatePlayCycle(this.currentPlayCycle());
    const volumeSlider = document.getElementById("volumeSlider");
    volumeSlider.value = this._volume;
    UI.updateVolumeBar(volumeSlider, this._volume);

    //Ui display saved volume
    //UI display saved play cycle
  }
}

export const Settings = new _Settings();
