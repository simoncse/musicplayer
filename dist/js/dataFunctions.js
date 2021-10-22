const getResultsFromAPI = async (query) => {
  // const max = 10;
  // const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=${max}&key=${YOUTUBE_API_KEY}`;
  // const encodedUrl = encodeURI(url);

  // try {
  //   const dataStream = await fetch(encodedUrl);
  //   const jsonData = await dataStream.json();
  //   return jsonData;
  // } catch (err) {
  //   console.log("something wrong");
  //   console.error(err);
  // }

  const params = {
    max: 10,
    query: query,
  };

  try {
    const dataStream = await fetch("./.netlify/functions/get_results", {
      method: "POST",
      body: JSON.stringify(params),
    });
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.error(err);
  }
};

export const searchOptions = {
  getResultsFromAPI: getResultsFromAPI,
  responseParser: (responseData) => {
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
