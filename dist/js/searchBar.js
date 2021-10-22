export const searchOptions = {
  searchUrl: new URL("https://youtube.googleapis.com/youtube/v3/search"),
  queryParam: ["part", "q", "type", "maxResults", "key"],
  responseParser: (responseData) => {
    console.log("parsing");
    const rawItems = responseData.items;
    const items = rawItems.map((item) => {
      return {
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        id: item.id.videoId,
      };
    });

    return items;
  },
  templateFunction: (result) => {
    return `
            <div class="title">${result.title}</div>
            <p class="channel">${result.channel}</p>
        `;
  },
  attachVideoID: (divElement, result) => {
    divElement.dataset.id = result.id;
  },
};
