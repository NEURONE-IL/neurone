import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayPage.html';

class DisplayPage {
  constructor($scope, $reactive, $state, $stateParams) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    // https://github.com/meteor/meteor/issues/7189
    this.documentPage = '';

    this.renderPage($stateParams.docName);
  }

  renderPage(docName) {
    this.call('getDocumentPage', '2020SummerOlympics', function(error, result) {
      if (!error) {
        console.log(result);
        this.documentPage = result;
        this.cond = true;
      }
      else {
        console.log(error);
      }
    });
  }
};

const name = 'displayPage';

// create a module
export default angular.module(name, [
  angularMeteor,
  angularSanitize,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: DisplayPage
})
.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('displayPage', {
      url: '/page/:docName',
      template: '<display-page></display-page>',
      resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        else {
          return $q.resolve();
        }
      }
    }
  });
};

// https://docs.angularjs.org/api/ng/directive/ngBindHtml