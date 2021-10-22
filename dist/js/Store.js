if (localStorage.getItem("settings") === null) {
  localStorage.setItem(
    "settings",
    JSON.stringify({
      searchMethod: "nameSearch",
      volume: 50,
      playCycle: "none",
      mute: false,
    })
  );
}

class Store {
  static getSettings(key) {
    const settings = JSON.parse(localStorage.getItem("settings"));
    return settings[key];
  }

  //** pass in as object literal */
  static setSettings(prop) {
    const obj = JSON.parse(localStorage.getItem("settings"));

    const updatedObj = { ...obj, ...prop };

    localStorage.setItem("settings", JSON.stringify(updatedObj));
  }

  static getCurrentSong() {
    const song = JSON.parse(localStorage.getItem("currentSong"));
    return song || {};
  }

  static setCurrentSong(song) {
    localStorage.setItem("currentSong", JSON.stringify(song));
  }

  static getSongs() {
    let songs;
    if (localStorage.getItem("songs") === null) {
      songs = [];
    } else {
      songs = JSON.parse(localStorage.getItem("songs"));
    }

    return songs;
  }

  static addSong(song) {
    const songs = Store.getSongs();
    songs.push(song);
    localStorage.setItem("songs", JSON.stringify(songs));
  }

  static removeSong(id) {
    const songs = Store.getSongs();
    songs.forEach((song, index) => {
      if (song.id === id) {
        console.log("found the song to be deleted");
        songs.splice(index, 1);
      }
    });
    localStorage.setItem("songs", JSON.stringify(songs));
  }
}

export default Store;
