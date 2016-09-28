import { Meteor } from 'meteor/meteor';

import Utils from '../../../lib/utils';
import LoggerConfigs from '../loggerConfigs';

export default class QueryTrackService {
  constructor() {}

  static saveQuery(queryText) {
    var current_url = window.location.href;
    var current_title = document.title;

    var queryObject = {
      title: current_title,
      url: current_url,
      local_time: Utils.getTimestamp()
    };

    if (Meteor.user() && !Utils.isEmpty(queryText)) {
      queryObject.owner = Meteor.userId();
      queryObject.username = Meteor.user().emails[0].address;
      queryObject.query = queryText;

      Meteor.call('storeQuery', queryObject, function(err, result) {});

      Utils.logToConsole('Query Saved! ' + queryText);
    }
  }
}