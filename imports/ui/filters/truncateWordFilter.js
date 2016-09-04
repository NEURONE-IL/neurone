import angular from 'angular';

const name = 'truncateWordFilter';

//
function TruncateWordFilter(text, wordLength) {
  return text;
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return TruncateWordFilter;
  });