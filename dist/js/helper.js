//Note that in order to return true or false, I wrapped it in a callback function to access the result variable as a Boolean

export function validVideoId(id, callback) {
  var img = new Image();
  img.src = "http://img.youtube.com/vi/" + id + "/mqdefault.jpg";
  img.onload = function () {
    const result = checkThumbnail(this.width);
    callback(result);
  };
}

function checkThumbnail(width) {
  //HACK a mq thumbnail has width of 320.
  //if the video does not exist(therefore thumbnail don't exist), a default thumbnail of 120 width is returned.
  if (width === 120) {
    return false;
  } else {
    return true;
  }
}

//format secs to min:sec
export const formatTime = (time) => {
  let min = Math.floor(time / 60);
  min < 10 ? (min = `0${min}`) : `${min}`;

  let sec = Math.floor(time % 60);
  sec < 10 ? (sec = `0${sec}`) : `${sec}`;

  return `${min}:${sec}`;
};

export const dispatchIDChangedEvent = (data) => {
  let event = new CustomEvent("VideoIDChanged", {
    detail: data,
  });
  document.dispatchEvent(event);
};
