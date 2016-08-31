import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as Search } from '../imports/ui/components/search/search';
import { name as SnippetList } from '../imports/ui/components/snippets/snippetList';

angular.module('prototype2', [
  angularMeteor,
  Search
]);