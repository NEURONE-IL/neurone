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

		this.$scope = $scope;
		this.$state = $state;
		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.kmtis = KMTrackIframeService;
		this.abis = ActionBlockerIframeService;

		$reactive(this).attach($scope);

		// dgacitua: Execute on iframe end
		this.$onDestroy = () => {
			this.$rootScope.documentTitle = '';
			this.$rootScope.documentRelevant = false;
			this.kmtis.antiService();
			this.abis.antiService();
		};

		this.iframeDoc = document.getElementById('pageContainer');

		this.page = $stateParams.docName || this.$rootScope.docName;
		this.routeUrl = '';
		this.documentTitle = '';

		// From https://github.com/meteor/meteor/issues/7189
		this.call('getDocument', this.page, (err, res) => {
			if (!err) {
				//console.log(res);
				this.routeUrl = res.routeUrl;
				this.documentTitle = res.title;
				this.$rootScope.documentTitle = res.title;
				this.$rootScope.documentRelevant = res.relevant;

				// dgacitua: Execute on iframe start
				// http://stackoverflow.com/a/17045721
				angular.element(this.iframeDoc).on('load', () => {
					console.log('Loading iframe trackers...', this.iframeDoc);
					this.abis.service();
					this.kmtis.service();
				});
			}
			else {
				console.error('Error while loading document', this.page, err);
				this.$state.go('error');		// TODO Change for current stage main page
			}
		});
	}
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