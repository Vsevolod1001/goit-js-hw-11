import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/style.css';
import NewsApiService from './js/news-service';
import Notiflix from 'notiflix';
import LoadMoreBtn from "./js/load_more_button";


const searchForm = document.querySelector('.search-form');
const articlesContainer = document.querySelector('.gallery');
    

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const newApiService = new NewsApiService();

searchForm.addEventListener('submit', onSearch);

function onSearch (e) {
    e.preventDefault();
    newApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
    if (newApiService.searchQuery === ''){
        return Notiflix.Notify.failure('Введите что-то для поиска изображений!');
        
      };
    loadMoreBtn.show();
    loadMoreBtn.disabled();
    newApiService.resetPage();

    
    newApiService.fetchArticles().then(hits => {
        clearHitsContainer ();
        appendArticlesMarkup(hits);
        loadMoreBtn.enable();
    });
   
};

loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


function onLoadMore () {
    newApiService.fetchArticles().then(appendArticlesMarkup);
}

function appendArticlesMarkup(hits) {
    const markupimg = hits.map(item =>
        `<div class="photo-card">
        <a href="${item.largeImageURL}" class="gallery__link">
            <img src="${item.previewURL}" alt="${item.tags}" loading="lazy" width='250' height='200' /></a>
            <div class="info">
                <p class="info-item">
                <b>Likes: ${item.likes}</b>
                </p>
                <p class="info-item">
                <b>Views: ${item.views}</b>
                </p>
                <p class="info-item">
                <b>Comments: ${item.comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads: ${item.downloads}</b>
                </p>
            </div>
        </div>`).join('');
    
    articlesContainer.insertAdjacentHTML('beforeend', markupimg);
    let gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
}

function clearHitsContainer () {
    articlesContainer.innerHTML = '';
   }