const name = 'searchResultsService';

export default class SearchResultsService {
  constructor() {
    this.savedData = {};  
  }  

  set(data) {
    this.savedData = data;
  }

  get() {
    return this.savedData;
  }
}