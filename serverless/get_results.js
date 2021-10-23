const fetch = require("node-fetch");
// import fetch from "node-fetch";

//from netlify environment variables
const { YOUTUBE_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { max, query } = params;
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=${max}&key=${YOUTUBE_API_KEY}`;

  try {
    const dataStream = await fetch(url);
    if (dataStream.status === 403) {
      throw { quotaExceeded: true, message: "API Daily Quota exceeded" };
    }
    const dataJson = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(dataJson),
    };
  } catch (err) {
    return { statusCode: 422, body: JSON.stringify(err) };
  }
};
