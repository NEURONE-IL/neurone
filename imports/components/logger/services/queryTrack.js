import { Meteor } from 'meteor/meteor';

import Utils from '../loggerUtils';
import LoggerConfigs from '../loggerConfigs';

export default class QueryTrackService {
  constructor($state) {
    'ngInject';

    this.$state = $state;
  }

  saveQuery(queryText) {
    if (Meteor.user() && !Utils.isEmpty(queryText)) {
      var queryObject = {
        owner: Meteor.userId(),
        username: Meteor.user().emails[0].address,
        query: queryText,
        title: document.title,
        url: this.$state.href(this.$state.current.name, this.$state.params, {absolute: false}),
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