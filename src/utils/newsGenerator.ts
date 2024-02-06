import axios from 'axios';
import FormData from 'form-data';
import Post from '../models/Post';

async function refreshTopHeadlinesNews(category: string) {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}`,
      {
        headers: {
          'X-Api-Key': process.env.NEWS_API_KEY,
        },
      }
    );
    const articles = response.data.articles;

    // login to the news user
    const loginData = {
      email: `${category}News@gmail.com`,
      password: `${category}News`,
    };
    const loginResponse = await axios.post(`${process.env.SERVER_URL_DEV}/auth/login`, loginData);
    const token = loginResponse.data.data.accessToken;

		console.log('fetched articles and logged in user, now creating posts')
    // create a post for each article that has a title, content, and urlToImage
    for (const article of articles.slice(0, 10)) {
      if (article.title && article.description && article.urlToImage) {
        // Fetch the image from the URL
        const imageResponse = await axios.get(article.urlToImage, {
          responseType: 'arraybuffer',
        });

        // Convert image data to a Blob or Buffer
        const image = Buffer.from(imageResponse.data, 'binary');
        // Form data for the POST request
        const formData = new FormData();
        formData.append('title', article.title.split('-')[0]);
        formData.append('content', article.description);
        formData.append('image', image, 'image.jpg');
				formData.append('category', category);

        await axios.post(`${process.env.SERVER_URL_DEV}/posts`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Created a post for article: ${article.title}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error);
  }
}

// Function to run the news generator
const run = async () => {
	const categories = ['sports', 'science', 'technology'];
	// const categories = ['sports'];
	for (const category of categories) {
		Post.deleteMany({ category }).then(() => console.log(`Deleted old posts for ${category}`));
		refreshTopHeadlinesNews(category).then(() => console.log(`Refreshed news for ${category}`));
	}
}

// Schedule the news generator to run every 24 hours
// cron.schedule('0 0 * * *', () => {
//   console.log('Running the news generator...');
//   runNewsGenerator();
// });


export default { run };