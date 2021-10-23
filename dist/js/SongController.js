import UI from "./UI.js";
import Store from "./Store.js";

export class Song {
  constructor(id, { title = "", duration = "" }) {
    this.id = id;
    this.title = title;
    this.duration = duration;
  }
}

const MusicInfoClosure = () => {
  let executed = false;

  //control how many times render method can be run
  const reset = (bool) => {
    executed = !bool;
  };

  const renderToDOM = (song) => {
    if (executed) return;
    if (isEmpty(song)) {
      UI.resetImage();
    } else {
      UI.setMusicInfo(song);
      UI.loadImage(song.id);
      executed = true;
    }
  };

  const updateCurrentSong = (song) => {
    if (Object.keys(song).length === 3) {
      Store.setCurrentSong(song);
    }
  };

  return {
    reset: reset,
    renderToDOM: renderToDOM,
    updateCurrentSong: updateCurrentSong,
  };
};

export const currentSong = Store.getCurrentSong();

export const MusicInfo = MusicInfoClosure();

//helpers
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
