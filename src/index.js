import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/imageSearch-service';
import './css/style.css';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('button[type="submit"]');

const imagesApiService = new ImagesApiService();
let gallery = new SimpleLightbox('.gallery a', {
  captions: false,
  showCounter: false,
});

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

loadMoreBtnHidden();

function onSearchForm(e) {
  e.preventDefault();
  imagesApiService.query = e.target.elements.searchQuery.value.trim();
  imagesApiService.resetPage();
  imagesApiService.getImages().then(response => {
    const { hits, totalHits } = response.data;
    console.log(hits);

    if (!hits.length) {
      clearGallery();
      loadMoreBtnHidden();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      e.target.reset();
      return;
    }

    if (imagesApiService.query.trim() === '') {
      clearGallery();
      loadMoreBtnHidden();
      Notiflix.Notify.info('You cannot search by empty field, try again.');
    } else {
      clearGallery();
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      galleryEl.insertAdjacentHTML('beforeend', renderImageCards(hits));
      gallery.refresh();
      smoothScroll();
      loadMoreBtnShow();

      if (Math.ceil(totalHits / 40) === imagesApiService.page) {
        noneLoadMore();
        return;
      }
    }
  });
}

function onLoadMoreBtn() {
  imagesApiService.page += 1;
  imagesApiService.getImages().then(response => {
    const { hits, totalHits } = response.data;

    loadMoreBtnShow();
    galleryEl.insertAdjacentHTML('beforeend', renderImageCards(hits));
    gallery.refresh();
    smoothScroll();
    if (Math.ceil(totalHits / 40) === imagesApiService.page) {
      noneLoadMore();
      return;
    }
  });
}

function renderImageCards(hits) {
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> <span class="info-item-api"> ${likes} </span>
                    </p>
                    <p class="info-item">
                        <b>Views</b> <span class="info-item-api">${views}</span>  
                    </p>
                    <p class="info-item">
                        <b>Comments</b> <span class="info-item-api">${comments}</span>  
                    </p>
                    <p class="info-item">
                        <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
                    </p>
                </div>
                </div>`;
      }
    )
    .join('');
  return markup;
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function loadMoreBtnHidden() {
  loadMoreBtn.classList.add('visually-hidden');
}

function loadMoreBtnShow() {
  loadMoreBtn.classList.remove('visually-hidden');
}

function noneLoadMore() {
  loadMoreBtnHidden();
  setTimeout(() => {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      { position: 'center-bottom' }
    );
  }, 4000);
}

// Цей код дозволяє автоматично прокручувати сторінку на висоту 2 карток галереї, коли вона завантажується
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
