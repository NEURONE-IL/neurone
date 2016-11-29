import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

import { name as Login } from '../auth/login';
import { name as Register } from '../auth/register';
import { name as Password } from '../auth/password';

import { name as ModalService } from '../../modules/modal';

import { name as Logger } from '../../logger/logger';
import Utils from '../../globalUtils';

const name = 'navigation';

class Navigation {
  constructor($scope, $rootScope, $reactive, $state, AuthService, BookmarkTrackService, SnippetTrackService, SessionTrackService, FlowService, ModalService) {
    'ngInject';

    this.$state = $state;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.fs = FlowService;
    this.sts = SnippetTrackService;
    this.bms = BookmarkTrackService;
    this.ses = SessionTrackService;
    this.auth = AuthService;
    this.modal = ModalService;

    $reactive(this).attach($scope);

    this.isSnippetEnabled = false;
    this.isBookmarkEnabled = false;
    this.isPageBookmarked = false;

    this.navbarMessage = '';
    this.navbarMessageId = 'navbarMessage';

    this.navbarVariables = {
      bookmarkedPages: 0,
    };

    this.$scope.$on('$stateChangeSuccess', (event) => {
      this.navbarMessage = '';
    });

    this.$rootScope.$on('setDocumentHelpers', (event, data) => {
      this.bms.isBookmarked((err, res) => {
        if (!err) {
          this.isSnippetEnabled = data;
          this.isBookmarkEnabled = data;
          this.isPageBookmarked = res;
          this.$scope.$apply();
          console.log('Bookmark Check!', this.isSnippetEnabled, this.isBookmarkEnabled, this.isPageBookmarked);
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
      enableSnippet: () => {
        return this.getReactively('isSnippetEnabled');
      },
      enableBookmark: () => {
        return this.getReactively('isBookmarkEnabled');
      },
      bookmarkStatus: () => {
        return this.getReactively('isPageBookmarked');
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
              this.isPageBookmarked = res2;
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
              this.isPageBookmarked = res2;
              this.$scope.$apply();
            }
          });
        }
      });
    });
  }

  logout() {
    this.auth.logout((err, res) => {
      if (!err) {
        this.$state.go('home');
      }
    });
    /*
    this.fs.stopFlow();
    this.ses.saveLogout();
    Accounts.logout((err, res) => {
      if (!err) {
        UserStatus.stopMonitor();
        this.$state.go('home');
      }
      else {
        console.error('Error while logging out!', err);
      }
    });
    */
  }

  openModal() {
    this.modal.openModal();
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  Logger,
  Login,
  Register,
  Password,
  ModalService
])
.component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});