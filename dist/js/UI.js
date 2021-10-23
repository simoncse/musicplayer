import { formatTime } from "./helper.js";
import Store from "./Store.js";

class UI {
  static displaySearchMethod(method) {
    const nameBtn = document.getElementById("searchByName-btn");
    const IDBtn = document.getElementById("searchByID-btn");
    const searchBtn = document.getElementById("searchBar-btn");
    if (method === "nameSearch") {
      nameBtn.classList.add("active");
      IDBtn.classList.remove("active");
      searchBtn.classList.add("none");
      setInputPlaceHolder("Search for a song on Youtube");
    } else if (method === "IDSearch") {
      IDBtn.classList.add("active");
      nameBtn.classList.remove("active");
      searchBtn.classList.remove("none");
      setInputPlaceHolder("Youtube video ID or full URL");
    }
    document.getElementById("menu").classList.add("visible");
  }

  static clearInput() {
    document.getElementById("searchBar-input").value = "";
  }

  static setPlayStyle(option) {
    if (option === "play") {
      document.getElementById("playBtn").classList.remove("pause");
    } else {
      document.getElementById("playBtn").classList.add("pause");
    }
  }

  static handlePlayBtn(event, callback) {
    //callback contains: play and pause methods on the global player object from youtube Iframe api
    //get the button element;
    const btn = event.target.closest("#playBtn");

    if (btn.classList.contains("pause")) {
      btn.classList.remove("pause");
      callback.play();
    } else {
      btn.classList.add("pause");
      callback.pause();
    }
  }

  static animateSlider(slider, currentTime, callback) {
    if (!callback.getCurrentTime()) return;

    //handle the animation of slider when the song is playing
    //without user interaction on the slider
    slider.value = callback.getCurrentTime();
    currentTime.innerText = formatTime(slider.value);
    const valPercent = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right,#F5A66F ${valPercent}%, rgba(255,255,255,0.2)  ${valPercent}%)`;
  }

  static updateSliderByVal(slider, currentTime, val) {
    //user interaction on the slider when they input a value on the slider (click or drag on it)
    currentTime.innerText = formatTime(val);
    const valPercent = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right,#F5A66F ${valPercent}%, rgba(255,255,255,0.2)  ${valPercent}%)`;
  }

  static updateVolumeBar(volumeBar, val) {
    const valPercent = (val / volumeBar.max) * 100;
    const btn = volumeBar.previousElementSibling;
    UI.updateVolumeIndicator(btn, val);
    volumeBar.style.background = `linear-gradient(to right,#EF643C  ${valPercent}%, rgba(255,255,255,0.2)  ${valPercent}%)`;
  }

  static setMusicInfo({ title, duration }) {
    document.getElementById("playingTitle").textContent = title;
    document.getElementById("songDuration").innerText = formatTime(duration);
    document.getElementById("slider").max = duration;
  }

  static loadImage(id) {
    const cover = document.getElementById("playingCover");
    cover.classList.remove("show");
    cover.classList.remove("music-note");
    const src = "http://img.youtube.com/vi/" + id + "/mqdefault.jpg";
    cover.style.backgroundImage = `url('${src}')`;
    cover.classList.add("show");
  }

  static resetImage() {
    const cover = document.getElementById("playingCover");
    cover.classList.add("show");
    cover.classList.add("music-note");
  }

  static displaySongs() {
    const songs = Store.getSongs();

    songs.forEach((song) => UI.addSongToList(song));
  }

  static addSongToList(song) {
    const list = document.getElementById("playlist-items");

    const li = document.createElement("li");
    li.setAttribute("data-id", song.id);
    li.classList.add("playlist-item");
    li.innerHTML = `
    <div class="title">${song.title}</div>
    <div class="duration">${formatTime(song.duration)}</div>
    <div class="delete"><i class="ph-trash"></i></div>
  `;

    list.appendChild(li);
  }

  static removeSong(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.remove();
    }
  }

  static hightlightSong(id) {
    if (!id) return;
    let selector = `[data-id='${id}']`;
    const list = document.getElementById("playlist-items");
    if (list.querySelectorAll("li").length >= 1) {
      list.querySelectorAll("li").forEach((li) => {
        li.classList.remove("active");
      });
      list.querySelector(selector).classList.add("active");
    }
  }

  static resetHightlightSong() {
    const list = document.getElementById("playlist-items");
    if (list.querySelectorAll("li").length > 1) {
      list.querySelectorAll("li").forEach((li) => {
        li.classList.remove("active");
      });
    }
  }

  static updatePlayCycle(cycle) {
    const btn = document.getElementById("playCycleBtn");

    switch (cycle) {
      case "none":
        btn.classList.add("no-repeat");
        break;
      case "once":
        btn.classList.remove("no-repeat");
        btn.querySelector(".ph-repeat-fill").classList.add("none");
        btn.querySelector(".ph-repeat-once-fill").classList.remove("none");
        break;
      case "all":
        btn.classList.remove("no-repeat");
        btn.querySelector(".ph-repeat-fill").classList.remove("none");
        btn.querySelector(".ph-repeat-once-fill").classList.add("none");
        break;
    }
  }

  static updateVolumeIndicator(btn, val) {
    if (val == 0) {
      btn.querySelectorAll("i")[2].classList.remove("none");
      btn.querySelectorAll("i")[1].classList.add("none");
      btn.querySelectorAll("i")[0].classList.add("none");
    } else if (val <= 48) {
      btn.querySelectorAll("i")[1].classList.remove("none");
      btn.querySelectorAll("i")[0].classList.add("none");
      btn.querySelectorAll("i")[2].classList.add("none");
    } else {
      btn.querySelectorAll("i")[0].classList.remove("none");
      btn.querySelectorAll("i")[1].classList.add("none");
      btn.querySelectorAll("i")[2].classList.add("none");
    }
  }

  static showModal(contentHtml) {
    const modal = document.createElement("div");

    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal__inner">
    <div class="modal__top">
      <button class="modal__close" type="button">
        <i class="ph-x"></i>
      </button>
    </div>
    <div class="modal__content">
      <p>${contentHtml}</p>
    </div>
    <div class="modal__bottom">
      <button type="button" class="modal__button">OK</button>
    </div>
  </div>
    `;

    modal.querySelector(".modal__close").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.querySelector(".modal__button").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
    setTimeout(() => {
      modal.classList.add("modal__show");
    }, 5);
  }
}

function setInputPlaceHolder(text) {
  const input = document.getElementById("searchBar-input");
  input.setAttribute("placeholder", text);
}

export default UI;
