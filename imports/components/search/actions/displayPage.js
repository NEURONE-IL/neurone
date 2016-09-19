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
    //var page = require('../../../../public/pages/Yao Ming - Wikipedia, the free encyclopedia.html');
    //var pageAssets = require('../../../../public/pages/Yao Ming - Wikipedia, the free encyclopedia_files');

    //this.myPage = page;

    this.renderPage($stateParams.docName);
  }

  // https://docs.angularjs.org/api/ng/directive/ngBindHtml
  renderPage(docName) {
    var asset = '2016 Summer Olympics - Wikipedia, the free encyclopedia',
     pagePath = 'pages/' + asset + '.html',
     assetDir = 'pages/' + asset + '_archivos';

    this.call('getPageAsset', pagePath, function(error, result) {
      if (!error) {
        this.pageAsset = result;
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