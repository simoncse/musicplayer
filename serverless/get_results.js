const fetch = require("node-fetch");

//from netlify environment variables
const { YOUTUBE_API_KEY } = process.env;

exports.handlers = async (event, context) => {
  const params = JOSN.parse(event.body);
  const { max, query } = params;
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=${max}&key=${YOUTUBE_API_KEY}`;

  try {
    const dataStream = await fetch(url);
    const dataJson = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(dataJson),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};
