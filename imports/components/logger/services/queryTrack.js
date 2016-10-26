import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class QueryTrackService {
  constructor($state, $rootScope) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
  }

  saveQuery(queryText) {
    if (Meteor.user() && !Utils.isEmpty(queryText)) {
      var pageTitle = this.$rootScope.documentTitle,
            pageUrl = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      var queryObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        query: queryText,
        title: (pageTitle ? pageTitle : document.title),
        url: (pageUrl ? pageUrl : window.location.href),
        local_time: Utils.getTimestamp()
      };

      Meteor.call('storeQuery', queryObject, (err, result) => {
        if (!err) {
          Utils.logToConsole('Query Saved!', queryObject.query, queryObject.local_time);
        }
        else {
          Utils.logToConsole('Unknown Error');
        }
      });
    }
  }
}