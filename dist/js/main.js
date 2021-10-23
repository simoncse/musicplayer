import { Settings } from "./Settings.js";
import { currentSong, MusicInfo } from "./SongController.js";
import Store from "./Store.js";
import { searchOptions } from "./dataFunctions.js";
import InstantSearch from "./InstantSearch.js";
import IDSearch from "./IDSearch.js";
import UI from "./UI.js";
import { Playlist } from "./PlaylistController.js";
import { dispatchIDChangedEvent } from "./helper.js";

// load the Youtube Iframe api as per documenation
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//Some UI setups before the app starts.
Settings.renderToDOM();
UI.displaySongs();
Playlist.inPlaylist(currentSong) && UI.hightlightSong(currentSong.id);

handleSearchMethodChange();
MusicInfo.renderToDOM(currentSong);
console.log(currentSong);

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  const searchBar = document.getElementById("searchBar");
  const nameSearch = new InstantSearch(searchBar, searchOptions);
  const idSearch = new IDSearch(document.getElementById("searchBar-form"));

  nameSearch.addListeners();
  idSearch.addListeners();

  const playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", handlePlayBtn);

  toggleFocus();
  handleClickSearchItem();
};

var player;

//Youtube Iframe API Setup
window.onYouTubeIframeAPIReady = function () {
  console.log("onYouTubeIframeAPIReady");
  player = new YT.Player("ytplayer", {
    height: "270",
    width: "300",
    videoId: "",
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });

  // window.player = player;
};

function onPlayerReady(event) {
  console.log("ready");

  runSongfromStorage();

  document.addEventListener("VideoIDChanged", (e) => {
    console.log("new video id has been found");
    player.loadVideoById(e.detail.videoId);
    currentSong.id = e.detail.videoId;
    console.log(currentSong);
    MusicInfo.reset(true);

    if (Playlist.inPlaylist(currentSong)) {
      console.log("in playlist");
      UI.hightlightSong(currentSong.id);
    } else {
      UI.resetHightlightSong();
    }
  });

  //handle user dragging or clicking on the slider
  document
    .getElementById("slider")
    .addEventListener("input", handleSliderChange);

  //Volume
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeBtn = document.getElementById("volumeBtn");

  //loading saved volume setting
  event.target.setVolume(Settings.currentVolume());

  event.target.playVideo();

  //handle volume change
  volumeSlider.addEventListener("input", handleVolumeChange);

  //handle volume indicator change;
  volumeBtn.addEventListener("click", handleVolumeBtn);

  // handle adding new song to playlist.
  const addMusicBtn = document.getElementById("addMusic-btn");
  addMusicBtn.addEventListener("click", handleAddToPlaylist);

  //playlist
  const playlist = document.getElementById("playlist");
  playlist.addEventListener("click", handlePlayList);

  //player control : previous and next
  document.getElementById("prevBtn").addEventListener("click", handlePrevBtn);
  document.getElementById("nextBtn").addEventListener("click", handleNextBtn);
  console.log(currentSong);

  //play cycle control
  const playCycleBtn = document.getElementById("playCycleBtn");
  playCycleBtn.addEventListener("click", handleCycleChange);
}

let interval;
function onPlayerStateChange(event) {
  // console.log(event.data);
  clearInterval(interval);

  if (event.data === YT.PlayerState.ENDED) {
  }

  // when video is unstarted (see the api doc for the state code)
  if (event.data == -1) {
  }

  // when video is playing. Note: getVideoData() and getDuration() only available when it starts playing.
  if (event.data == 1) {
    UI.setPlayStyle("play");
    const { title } = player.getVideoData();
    currentSong.title = title;
    currentSong.duration = player.getDuration();
    console.log(currentSong);
    MusicInfo.renderToDOM(currentSong);
    MusicInfo.updateCurrentSong(currentSong);

    Playlist.setIndex(currentSong);

    interval = setInterval(updateSlider, 500);
  }

  // when pause video
  if (event.data == 2) {
    console.log("pause");
    clearInterval(interval);
  }

  //when video ends;
  if (event.data == 0) {
    console.log("end");
    const cycle = Settings.currentPlayCycle();

    if (cycle === "none") return;

    if (cycle === "once") {
      event.target.playVideo();
    } else {
      Playlist.startNext();
    }
  }
}

// Procedural functions
const runSongfromStorage = () => {
  console.log("run song after refresh (ls)");
  if (!Store.getCurrentSong()) return;

  player.loadVideoById(Store.getCurrentSong().id);
};

const handlePlayBtn = (event) => {
  const playerControl = {
    play: () => player.playVideo(),
    pause: () => player.pauseVideo(),
  };
  UI.handlePlayBtn(event, playerControl);
};

const updateSlider = () => {
  const slider = document.getElementById("slider");
  const currentTime = document.getElementById("currentTime");
  const callback = {
    getCurrentTime: () => player.getCurrentTime(),
  };
  UI.animateSlider(slider, currentTime, callback);
};

const handleSliderChange = (event) => {
  const slider = document.getElementById("slider");
  const currentTime = document.getElementById("currentTime");
  player.seekTo(event.target.value);
  UI.updateSliderByVal(slider, currentTime, event.target.value);
};

const handleVolumeChange = (event) => {
  player.setVolume(event.target.value);
  Settings.updateVolume(event.target.value);
  UI.updateVolumeBar(event.target, event.target.value);
};

const handleVolumeBtn = (event) => {
  const mute = Settings.mute();
  if (!mute) {
    player.mute();
    Settings.toggleMute();
    UI.updateVolumeIndicator(event.target, 0);
  } else {
    player.unMute();
    Settings.toggleMute();
    UI.updateVolumeIndicator(event.target, Settings.currentVolume());
  }
};

function handleSearchMethodChange() {
  const nameSearchBtn = document.getElementById("searchByName-btn");
  const IDSearchBtn = document.getElementById("searchByID-btn");

  nameSearchBtn.addEventListener("click", () => {
    UI.displaySearchMethod("nameSearch");
    Settings.updateSearchMethod("nameSearch");
  });

  IDSearchBtn.addEventListener("click", () => {
    UI.displaySearchMethod("IDSearch");
    Settings.updateSearchMethod("IDSearch");
  });
}

// Functions relate to using name search
const toggleFocus = () => {
  document.addEventListener("click", (e) => {
    const isSearchBar = e.target.closest("#searchBar");
    if (!isSearchBar) {
      document.querySelector(".searchResults").classList.remove("visible");
      document.querySelector(".searchResults").style.display = "none";
    }
  });
};

const handleClickSearchItem = () => {
  document.addEventListener("click", (e) => {
    const resultItem = e.target.closest(".searchResult[data-id]");
    if (!resultItem) return;

    console.log(resultItem);

    dispatchIDChangedEvent({ videoId: resultItem.dataset.id });
    document.querySelector(".searchResults").classList.remove("visible");
    document.querySelector(".searchResults").style.display = "none";
    UI.clearInput();
  });
};

//playlist functions
const handleAddToPlaylist = () => {
  if (Playlist.inPlaylist(currentSong)) {
    UI.showModal("Already saved in playlist");

    return;
  }

  UI.addSongToList(currentSong);
  UI.hightlightSong(currentSong.id);
  Store.addSong(currentSong);
};

const handlePlayList = (e) => {
  //Remove song
  const deleteBtn = e.target.closest(".delete");
  if (deleteBtn) {
    const id = deleteBtn.parentElement.dataset.id;
    console.log(id);
    UI.removeSong(deleteBtn);
    Store.removeSong(id);
    return;
  }

  //select a song to play;
  const selectedSong = e.target.closest("[data-id]");
  if (selectedSong) {
    console.log("playlist controller:");
    Playlist.loadSong(selectedSong.dataset.id);
    UI.hightlightSong(selectedSong.dataset.id);
  }
};

const handlePrevBtn = () => {
  Playlist.goBack();
};

const handleNextBtn = () => {
  Playlist.startNext();
};

const handleCycleChange = () => {
  Settings.updatePlayCycle();
  const cycle = Settings.currentPlayCycle();
  UI.updatePlayCycle(cycle);
};
