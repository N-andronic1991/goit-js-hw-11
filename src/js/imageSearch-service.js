import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34450694-7da2448b2cde1dc24466667c8';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  async getImages() {
    try {
      return await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          page: this.page,
          per_page: this.per_page,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
