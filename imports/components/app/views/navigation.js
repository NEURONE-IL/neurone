import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { name as Logger } from '../../logger/logger';
import Utils from '../../globalUtils';

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

    this.$scope.$on('$stateChangeSuccess', (event) => {
      this.navbarMessage = '';
    });

    this.$rootScope.$on('setDocumentHelpers', (event, data) => {
      this.bms.isBookmarked((err, res) => {
        if (!err) {
          this.isOnPage = data;
          this.isBookmarked = res;
          this.$scope.$apply();
          //console.log('Bookmark Check!', this.isOnPage, this.isBookmarked);
        }
        else {
          console.error(err);
        }
      });
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
      this.$scope.$apply(() => {
        this.navbarMessage = res ? res : err;
        Utils.notificationFadeout(this.navbarMessageId);
        //this.navbarMessageElement = angular.element(document.getElementById(this.navbarMessageId));
        //this.navbarMessageElement.stop(true, true);
        //this.navbarMessageElement.fadeIn(0);
        //this.navbarMessageElement.fadeOut(5000); 
      });
    });
  }

  saveBookmark() {
    this.bms.saveBookmark((err, res) => {
      this.$scope.$apply(() => {
        this.navbarMessage = res ? res : err;
        Utils.notificationFadeout(this.navbarMessageId);
        //this.navbarMessageElement = angular.element(document.getElementById(this.navbarMessageId));
        //this.navbarMessageElement.stop(true, true);
        //this.navbarMessageElement.fadeIn(0);
        //this.navbarMessageElement.fadeOut(5000); 

        if (!err) {
          this.bms.isBookmarked((err2, res2) => {
            if (!err2) {
              this.isBookmarked = res2;
              this.$scope.$apply();
            }
          });
        }
      });
    });
  }

  removeBookmark() {
    this.bms.removeBookmark((err, res) => {
      this.$scope.$apply(() => {
        this.navbarMessage = res ? res : err;
        Utils.notificationFadeout(this.navbarMessageId);
        //this.navbarMessageElement = angular.element(document.getElementById(this.navbarMessageId));
        //this.navbarMessageElement.stop(true, true);
        //this.navbarMessageElement.fadeIn(0);
        //this.navbarMessageElement.fadeOut(5000); 

        if (!err) {
          this.bms.isBookmarked((err2, res2) => {
            if (!err2) {
              this.isBookmarked = res2;
              this.$scope.$apply();
            }
          });
        }
      });
    });
  }

  logout() {
    this.ses.saveLogout();
    Accounts.logout((err, res) => {
      if (!err) {
        this.$state.go('home');
      }
      else {
        console.error('Error while logging out!', err);
      }
    });
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