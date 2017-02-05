import angularSanitize from 'angular-sanitize';

import 'mark.js';

import template from './displayIframe.html';

import { name as Logger } from './services/kmTrackIframe';
import { name as ActionBlocker } from './services/actionBlockerIframe';

class DisplayIframe {
	constructor($scope, $rootScope, $timeout, $reactive, $state, $stateParams, $document, KMTrackIframeService, ActionBlockerIframeService) {
		'ngInject';

		this.$scope = $scope;
		this.$state = $state;
		this.$rootScope = $rootScope;
		this.$stateParams = $stateParams;
		this.$timeout = $timeout;
		this.$document = $document;
		this.kmtis = KMTrackIframeService;
		this.abis = ActionBlockerIframeService;

		$reactive(this).attach($scope);

		// dgacitua: Execute on iframe end
		this.$onDestroy = () => {
			this.$rootScope.docId = '';
			this.$rootScope.documentTitle = '';
			this.$rootScope.documentRelevant = false;
			//this.kmtis.antiService();
			//this.abis.antiService();
		};

		this.$rootScope.$on('changeIframePage', (event, data) => {
			this.loadPage(data);
		});

		this.$rootScope.$on('iframeSnippet', (event, data) => {
			this.loadPage(data.docId, data.snippet);
		});

		this.iframeDoc = document.getElementById('pageContainer');

		this.pageUrl = this.page || this.$stateParams.docName || this.$rootScope.docId;
    this.snippet = this.snip || this.$rootScope.snippet || '';
		this.routeUrl = '';
		this.documentTitle = '';

		this.loadPage(this.pageUrl, this.snippet);
	}

	loadPage(pageUrl, snippet='') {
		console.log('loadPage', pageUrl, snippet);
		Session.set('docId', pageUrl);

		// dgacitua: https://github.com/meteor/meteor/issues/7189
		this.call('getDocument', pageUrl, (err, res) => {
			if (!err) {
        // dgacitua: http://stackoverflow.com/a/3608791
				this.routeUrl = encodeURI(res.routeUrl);    //res.routeUrl;
				this.documentTitle = res.title;
				this.$rootScope.docId = res._id;
				this.$rootScope.documentTitle = res.title;
				this.$rootScope.documentRelevant = res.relevant;

				// dgacitua: Execute on iframe start
				// http://stackoverflow.com/a/17045721
				angular.element(this.iframeDoc).on('load', () => {
					console.log('Loading iframe trackers...');
					this.abis.service();
					this.kmtis.service();

          if (snippet) {
            console.log('Highlighting text!', snippet);
            this.highlightSnippet(snippet); 
          }
				});

        // dgacitua: Execute on iframe end
				angular.element(this.iframeDoc.contentWindow).on('unload', () => {
					console.log('Unloading iframe trackers...');
					this.kmtis.antiService();
					this.abis.antiService();
				});
			}
			else {
				console.error('Error while loading document', pageUrl, err);
				//this.$state.go('error');		// TODO Change for current stage main page
			}
		});
	}

	highlightSnippet(snippet) {
    var snip = snippet || '';
    
    var searchables = document.getElementById('pageContainer').contentDocument;   //this.$document.find('.highlight').toArray();
    var markInstance = new Mark(searchables);

    markInstance.unmark({ iframes: true, done: () => {
        markInstance.mark(snip, {
          accurracy: 'exactly',
          iframes: true,
          acrossElements: true,
          separateWordSearch: false,
          className: 'highlightSnippet'
        });
      } 
    });
  }
}

const name = 'displayIframe';

export default angular.module(name, [
	Logger,
	ActionBlocker
])
.component(name, {
	template,
	controllerAs: name,
	controller: DisplayIframe,
  bindings: {
    page: '=',
    snip: '='
  }
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