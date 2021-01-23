import angularSanitize from 'angular-sanitize';
import angularTruncate from 'angular-truncate-2';

import Mark from 'mark.js';

import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './search.html';

import * as L from 'leaflet'



class Search {
  constructor($scope, $rootScope, $reactive, $document, $state, $stateParams, $sanitize, UserDataService, QueryTrackService, EventTrackService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$document = $document;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;

    this.uds = UserDataService;
    this.qts = QueryTrackService;
    this.ets = EventTrackService;
    this.multimediaObjects = "";
    this.key = process.env.MAPTILER_KEY || 'XNctrGMVMOj0xErblNkx'

    $scope.$on('$stateChangeStart', (event) => {
      Session.set('lockButtons', true);
      
      this.uds.setSession({
        bookmarkButton: false,
        unbookmarkButton: false,
        bookmarkList: false,
        backButton: false,
        readyButton: false,
        statusMessage: ''
      });
    });

    $scope.$on('$stateChangeSuccess', (event) => {
      this.uds.setSession({
        bookmarkButton: false,
        unbookmarkButton: false,
        bookmarkList: true,
        backButton: false,
        stageHome: '/search',
        statusMessage: ''
      }, (err, res) => {
        if (!err) {
          // TODO optimize code
          var limit = this.uds.getConfigs().minBookmarks;
          var setReady = !!(this.uds.getSession().bookmarkCount >= limit);
          this.uds.setSession({ readyButton: setReady });

          var stageNumber = this.uds.getSession().currentStageNumber,
             currentStage = this.uds.getConfigs().stages[stageNumber];
          
          this.multimediaObjects = currentStage.multimedia;

          this.uds.setSession({ currentStageName: currentStage.id, currentStageState: currentStage.state });

          this.$rootScope.$broadcast('updateNavigation');

          console.log('Search loaded!');
        }
        else {
          console.error('Error while loading Search!', err);
        }
      });
    });


    $reactive(this).attach($scope);

    this.avatar = this.uds.getConfigs().avatar;

    this.searchText = this.$stateParams.query || '';
    this.firstSearch = false;
    this.resultsReady = false;
    this.getResults(this.$stateParams.query);
    
  }

  doSearch() {
    var queryText = this.searchText.toString();
    this.getResults(queryText);
  }

  getResults(queryText) {
    const fetch = require('node-fetch');
    if (!Utils.isEmpty(queryText)) {
      this.firstSearch = true;
      this.qts.saveQuery(queryText);
      this.$state.go('.', {query: queryText}, {notify: false});

      // TODO Verify topic=>domain & test=>task
      let queryObj = {
        query: queryText,
        locale: this.uds.getConfigs().locale,
        task: this.uds.getConfigs().task,
        domain: this.uds.getConfigs().domain
      };

      console.log(queryObj);

      this.call('searchDocuments', queryObj, function(err, res) {
        if (!err) {
          this.documents = res.filter(doc => doc.type != 'image');
          this.images = res.filter(img => img.type == 'image');
          this.videos = res.filter(vid => vid.type == 'video');
          this.books = res.filter(book => book.type == 'book');
          console.log(res.length)
          
          // dgacitua: Pagination
          var multimediaEnabled = this.uds.getConfigs().stages[this.uds.getSession().currentStageNumber].multimedia;
          
          console.log(multimediaEnabled)

          if (multimediaEnabled.maps) {
            const container = document.getElementById('map')
            console.log(container)
            if(container){
              this.map.invalidateSize()
              var urlGet = 'https://api.maptiler.com/geocoding/'+this.$stateParams.query+'.json?key='+this.key,
                  popup;
          
              fetch(urlGet)
              .then(res => res.json())   
              .then(json => {
                this.doc = json.features[0];
                this.map.fitBounds([[this.doc.bbox[1],[this.doc.bbox[0]]],[this.doc.bbox[3],[this.doc.bbox[2]]]])
                popup =L.popup().setLatLng(this.doc.center.reverse()).setContent(this.doc.place_type +' '+ this.doc.place_name).openOn(this.map)
              })
            }
          }

          this.videoResults = this.videos.length;
          this.booksResults = this.books.length;
          this.totalResults = this.documents.length - 
                              //this.images.length -//(this.images.length * (+ !multimediaEnabled.image)) -
                              (this.videoResults * (+ !multimediaEnabled.video)) -
                              (this.booksResults * (+ !multimediaEnabled.book));
          this.currentPage = 1;
          this.resultsPerPage = 10;
          this.paginationMaxSize = 5;

          // dgacitua: Apply changes
          this.resultsReady = true;
          this.$scope.$apply();

          if (!this.initMap && multimediaEnabled.maps){
            this.map = L.map('map', {
              center: [0,0],
              zoom: 1
              })
              L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=' + this.key,{//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                                        maxZoom: 19,
                                        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'})
              .addTo(this.map); 
              this.initMap = true;
             
              var urlGet = 'https://api.maptiler.com/geocoding/'+this.$stateParams.query+'.json?key='+this.key,
                  popup;
          
              fetch(urlGet)
              .then(res => res.json())   
              .then(json => {
                this.doc = json.features[0];
                this.map.fitBounds([[this.doc.bbox[1],[this.doc.bbox[0]]],[this.doc.bbox[3],[this.doc.bbox[2]]]])
                popup =L.popup().setLatLng(this.doc.center.reverse()).setContent(this.doc.place_type +' '+ this.doc.place_name).openOn(this.map)
              })
          } 
          //this.highlightSearch(queryText);
          //this.$scope.$apply();
        }
        else {
          console.error(err);
          this.resultsReady = true;
          this.$scope.$apply();
        }
      });
    }
  }

  highlightSearch(queryText) {
    var qt = queryText ? queryText : '';
    check(qt, String);

    var searchables = this.$document.find('.highlight').toArray();
    var markInstance = new Mark(searchables);

    // dgacitua: Unmark old results
    markInstance.unmark();
    this.$scope.$apply();

    // dgacitua: Mark new results
    markInstance.mark(qt, { className: 'highlightSearch' });
    this.$scope.$apply();
  }

  storeEvent(action, params) {
    this.ets.storeCustomEvent(action, params, (err, res) => {});
  }
  fix(){
    this.map.invalidateSize()
  }
}

const name = 'search';

// create a module
export default angular.module(name, [
  'ngSanitize',
  'truncate',
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: Search
})
.config(config);

function generateMap(map){
  'ngInject';
  
}

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('search', {
    url: '/search?query',
    views:{
        '@': {
        template: '<search></search>'
      }
    },
    resolve: {
      userLogged($q) {
        if (!!Meteor.userId()) return $q.resolve();
        else return $q.reject('AUTH_REQUIRED');
      },
      dataReady(userLogged, $q, UserDataService) {
        let uds = UserDataService;
        return uds.ready().then(
          (res) => { return $q.resolve() },
          (err) => { return $q.reject('USERDATA_NOT_READY') }
        );
      },
      stageLock(dataReady, $q, UserDataService) {
        let uds = UserDataService,
           cstn = uds.getSession().currentStageNumber,
           csst = uds.getConfigs().stages[cstn].state,
           cstp = uds.getConfigs().stages[cstn].urlParams,
           stst = 'search';

        if (csst !== stst) return $q.reject('WRONG_STAGE');
        else return $q.resolve();
      }
    }
  });
};