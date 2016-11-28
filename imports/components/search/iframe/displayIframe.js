import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

import template from './displayIframe.html';

import { name as Logger } from './services/kmTrackIframe';
import { name as ActionBlocker } from './services/actionBlockerIframe';

class DisplayIframe {
	constructor($scope, $rootScope, $timeout, $reactive, $state, $stateParams, KMTrackIframeService, ActionBlockerIframeService) {
		'ngInject';

		this.$state = $state;
		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.kmtis = KMTrackIframeService;
		this.abis = ActionBlockerIframeService;

		// dgacitua: Execute on iframe end
		this.$onDestroy = () => {
			this.$rootScope.documentTitle = '';
			this.kmtis.antiService();
			this.abis.antiService();
		};

		// dgacitua: Execute on iframe start
		angular.element(document.getElementById('pageContainer')).on('load', () => {
			this.abis.service();
			this.kmtis.service();
		});

		$reactive(this).attach($scope);

		this.page = $stateParams.docName || this.$rootScope.docName;
		this.routeUrl = '';
		this.documentTitle = '';
		this.renderPage(this.page);
	}

	// From https://github.com/meteor/meteor/issues/7189
	renderPage(docName) {
		this.call('getDocument', docName, (error, result) => {
			if (!error) {
				this.routeUrl = result.routeUrl;
				this.documentTitle = result.title;
				this.$rootScope.documentTitle = result.title;
			}
			else {
				console.error(error);
			}
		});
	}

	/*
	startTracking() {
		// TODO fix quick right click between transitions
		this.abis.service();
		this.kmtis.service();
	}

	stopTracking() {
		this.$rootScope.documentTitle = '';
		this.kmtis.antiService();
		this.abis.antiService();
	}
	*/
}

const name = 'displayIframe';

export default angular.module(name, [
	angularMeteor,
	angularSanitize,
	uiRouter,
	Logger,
	ActionBlocker
])
.component(name, {
	template,
	controllerAs: name,
	controller: DisplayIframe
})
.directive('pageFrame', customIframe)
.directive('ngOnload', ngOnload)
.config(config);

function config($stateProvider) {
	'ngInject';

	$stateProvider
		.state('displayIframe', {
			url: '/iframe/:docName',
			template: '<display-iframe></display-iframe>',
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
}

// dgacitua: http://stackoverflow.com/a/27576128
function customIframe() {
	return {
		restrict: 'E',
		scope: {
			src: '&',
			callback: '=loading'
		},
		template: '<iframe id="pageContainer" ng-src="{{src()}}"></iframe>',
		link: (scope, element, attrs) => {
      element.on('load', () => scope.callback());
    }
	};
}

// dgacitua: https://gist.github.com/mikaturunen/f0b45def06bc83ccea9e
function ngOnload() {
  return {
    restrict: "A",
    scope: {
      callback: "&ngOnload"
    },
    link: (scope, element, attrs) => {
      element.on("load", () => scope.callback());
    }
  };
}