
const saveSelectedValueToCookie = (selectedValue) => {
  document.cookie = `NEWS=${selectedValue}`;
};

const getSelectedValueFromCookie = () => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "NEWS") {
      return value;
    }
  }
  return 10;
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    let count = document.getElementById("chooseNum");
    count.addEventListener("change", async function (event) {
      await fetchDataAndUpdateList(event.target.value);
      saveSelectedValueToCookie(event.target.value);
    });

    let count2 = getSelectedValueFromCookie();
    count.value = count2;
    await fetchDataAndUpdateList(count2);
  } catch (error) {
    console.error('Error:', error);
  }
});

async function fetchDataAndUpdateList(selectedValue) {
  try {
    const url = 'https://www.kore.co.il/flashNews';
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const headlines = doc.querySelectorAll('.h3');
    
    let latestNews = [];
    let newsIndex = 0;

    headlines.forEach((headline) => {
      const newsText = headline.textContent.trim();
      if (newsText && newsIndex < selectedValue) {
        newsIndex++;
        latestNews.push({ index: newsIndex, text: newsText });
      }
    });

    console.log(latestNews);
    updateNewsList(latestNews);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function updateNewsList(news) {
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '';

  news.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.index}. ${item.text} `;
    newsList.appendChild(listItem);
  });
}
