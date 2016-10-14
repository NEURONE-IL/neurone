import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { name as Logger } from '../../logger/logger';

const name = 'navigation';

class Navigation {
  constructor($scope, $rootScope, $q, $reactive, $state, BookmarkTrackService, SnippetTrackService, SessionTrackService) {
    'ngInject';

    this.$q = $q;
    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;

    $reactive(this).attach($scope);

    this.navbarMessage = '';
    this.navbarMessageId = 'navbarMessage';

    this.$rootScope.$on('setDocumentHelpers', (event, data) => {
      var url = window.location.href.toString();

      this.bms.isBookmarked((err, result) => {
        if (!err) {
          this.isOnPage = data;
          this.isBookmarked = result;
          //console.log('Bookmark Check!', this.isOnPage, this.isBookmarked);
          this.$scope.$apply();
        }
        else {
          console.log(err);
        }
      });
      /*
      this.call('isBookmark', url, (err, result) => {
        if (!err) {
          this.isOnPage = data;
          this.isBookmarked = result;
          //console.log('Bookmark Check!', this.isOnPage, this.isBookmarked);
        }
        else {
          console.log(err);
        }
      });
      */
    });

    this.helpers({
      isLoggedIn: () => {
        return !!Meteor.userId();
      },
      currentUser: () => {
        return Meteor.user();
      },
      enablePageHelpers: () => {
        return this.isOnPage;
      },
      enableBookmark: () => {
        return this.isBookmarked;
      }
    });
  }

  saveSnippet() {
    this.sts.saveSnippet((err, res) => {
      if (!err) {
        this.$scope.$apply(() => {
          this.navbarMessage = res;
          angular.element(document.getElementById(this.navbarMessageId)).stop(true, true);
          angular.element(document.getElementById(this.navbarMessageId)).fadeIn(0);
          angular.element(document.getElementById(this.navbarMessageId)).fadeOut(5000); 
        });
      }
    });
  }

  saveBookmark() {
    this.bms.saveBookmark((err, res) => {
      if (!err) {
        this.$scope.$apply(() => {
          this.navbarMessage = res;
          angular.element(document.getElementById(this.navbarMessageId)).stop(true, true);
          angular.element(document.getElementById(this.navbarMessageId)).fadeIn(0);
          angular.element(document.getElementById(this.navbarMessageId)).fadeOut(5000);
        });

        this.bms.isBookmarked((err, res2) => {
          if (!err) {
            this.isBookmarked = res2;
            this.$scope.$apply();
          }
        });
      }
    });
  }

  removeBookmark() {
    this.bms.removeBookmark((err, res) => {
      if (!err) {
        this.$scope.$apply(() => {
          this.navbarMessage = res;
          angular.element(document.getElementById(this.navbarMessageId)).stop(true, true);
          angular.element(document.getElementById(this.navbarMessageId)).fadeIn(0);
          angular.element(document.getElementById(this.navbarMessageId)).fadeOut(5000);
        });
        
        this.bms.isBookmarked((err, res2) => {
          if (!err) {
            this.isBookmarked = res2;
            this.$scope.$apply();
          }
        });
      }
    });
  }

  logout() {
    var p1 = this.ses.saveLogout();
    var p2 = Accounts.logout();

    this.$q.all([p1, p2]).then(this.$state.go('home'));
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  Logger,
  Login,
  Register,
  Password
])
.component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});