import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as App } from '../imports/ui/components/app/app';
import { name as Search } from '../imports/ui/components/search/search';
import { name as DocumentsList } from '../imports/ui/components/documents/documentsList';
import { name as SnippetList } from '../imports/ui/components/snippets/snippetList';

angular.module('prototype2', [
  angularMeteor,
  App,
  Search,
  DocumentsList,
  SnippetList
]);