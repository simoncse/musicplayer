import { Settings } from "./Settings.js";
// import { currentSong, currentSong } from "./SongController.js";
import Store from "./Store.js";
import { dispatchIDChangedEvent } from "./helper.js";
import UI from "./UI.js";
import { currentSong } from "./SongController.js";

// export default class PlayList {
//   const;
// }

const PlaylistClosure = () => {
  let currentIndex;

  const inPlaylist = (currentSong) => {
    if (Store.getSongs().some((s) => s.id === currentSong.id)) {
      return true;
    } else {
      return false;
    }
  };

  const setIndex = (currentSong) => {
    let songs = Store.getSongs();
    currentIndex = songs.findIndex((song) => song.id === currentSong.id);
  };

  const loadSong = (id) => {
    dispatchIDChangedEvent({ videoId: id });
  };

  const startNext = () => {
    let songs = Store.getSongs();
    let nextId;
    if (currentIndex === songs.length - 1) {
      nextId = songs[0].id;
    } else {
      nextId = songs[currentIndex + 1].id;
    }
    loadSong(nextId);
    UI.hightlightSong(nextId);
  };

  const goBack = () => {
    let songs = Store.getSongs();
    let prevId;
    if (currentIndex === 0) {
      prevId = songs[songs.length - 1].id;
    } else {
      prevId = songs[currentIndex - 1].id;
    }
    loadSong(prevId);
    UI.hightlightSong(prevId);
  };

  return {
    inPlaylist: inPlaylist,
    setIndex: setIndex,
    loadSong: loadSong,
    startNext: startNext,
    goBack: goBack,
  };
};

export const Playlist = PlaylistClosure();
