const crudUrl = '../back-end/crud.php';
const apiKey = '4GeEQXy0ttFKtsEC9NbVGmSpc66VLa84';

const topStoriesUrl = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;
const mostPopularUrl = `https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=${apiKey}`;

const articlesPerPage = 6;
let page = 0;

window.articles = [];

async function fetchTopStories() {
  try {
    const response = await fetch(topStoriesUrl);
    const data = await response.json();
    window.articles = data.results; 
    displayFeaturedArticle(data.results[0]); 
    displayArticles(data.results.slice(1));  
  } catch (error) {
    console.error('Erro ao buscar top stories:', error);
  }
}

function displayFeaturedArticle(article) {
  const featuredArticle = document.getElementById('featured-article');
  featuredArticle.innerHTML = `
    <h3>${article.title}</h3>
    <p>${article.abstract}</p>
    <a href="${article.url}" target="_blank">Read more</a>
  `;
}

function displayArticles(articles) {
  const articleContainer = document.getElementById('articles');
  const start = page * articlesPerPage;
  const end = start + articlesPerPage;
  const articlesToShow = articles.slice(start, end);

  articlesToShow.forEach((article) => {
    const articleEl = document.createElement('article');
    articleEl.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.abstract}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    articleContainer.appendChild(articleEl);
  });

  page++;
}

document.getElementById('load-articles').addEventListener('click', () => {
  if (window.articles && window.articles.length > page * articlesPerPage) {
    displayArticles(window.articles);
  } else {
    alert('Todos os artigos foram carregados.');
  }
});

document.getElementById('send-to-back').addEventListener('click', async () => {
  if (!window.articles || window.articles.length === 0) {
    alert('Nenhum artigo carregado. Busque os artigos primeiro.');
    return;
  }

  try {
    console.log(window.articles[0])
    const response = await fetch(crudUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: window.articles })
    });

    if (!response.ok) {
      throw new Error(`Erro no envio: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Resposta do servidor:', result);
    alert(result.message || 'Artigos enviados com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar artigos:', error);
    alert('Falha ao enviar os artigos. Verifique o console para mais detalhes.');
  }
});


fetchTopStories()