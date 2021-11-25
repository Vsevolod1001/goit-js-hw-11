import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchApi, firstPage } from "./js/news-service";

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let searchQuery = '';

hiddenButton(refs.loadMoreBtn);

refs.form.addEventListener('submit', Search);
refs.loadMoreButton.addEventListener('click', LoadMore);

function Search(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value;

  firstPage();

  hiddenButton(refs.loadMoreBtn);

  fetchApi(searchQuery)
    .then(images => {
      const imagesArray = images.data.hits;
      const totalImages = images.data.totalHits;
      // const lenghtGallery = refs.gallery.querySelectorAll('.gallery__item').length;

    if (imagesArray.length === 0) {
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.',);
    } else {
        clear();
        markupGallery(imagesArray);
        new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
        Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
        showButton(refs.loadMoreBtn);
      
          // console.log(lenghtGallery);
          // console.log(totalImages);
      }
    });
}


function LoadMore() {
    fetchApi(searchQuery)
    .then(images => {
      const imagesArray = images.data.hits;
      const totalImages = images.data.totalHits;
      const lenghtGallery = refs.gallery.querySelectorAll('.gallery__item').length+40;
      
      markupGallery(imagesArray);
      new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });

        // console.log(lenghtGallery);
        // console.log(totalImages);

      if (lenghtGallery >= totalImages) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        hiddenButton(refs.loadMoreButton);
      }
    })
  
    .catch(error => {
      console.log(error);
      hiddenButton(refs.loadMoreBtn);
    });
}

function markupGallery(images) {
  const markup = images
    .map(image => {
      return `
        <a class="gallery__item" href="${image.largeImageURL}">
          <div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${image.likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${image.views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${image.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${image.downloads}
              </p>
            </div>
          </div>
        </a>`;
    })
    .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clear() {
  refs.gallery.innerHTML = '';
}
function hiddenButton(item) {
    item.classList.add('visually-hidden');
}
function showButton(item) {
    item.classList.remove('visually-hidden');
}