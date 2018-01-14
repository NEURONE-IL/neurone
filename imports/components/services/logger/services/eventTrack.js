import { Meteor } from 'meteor/meteor';

import Utils from '../../../globalUtils';
import LoggerConfigs from '../../../globalConfigs';

export default class EventTrackService {
  constructor($state, $rootScope, $translate) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  storeCustomEvent(action, params, callback) {
    let msg = '';

    if (!!Meteor.userId()) {
      params.url = this.$state.href(this.$state.current.name, this.$state.params, {absolute: false});

      let event = {
        userId: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().emails[0].address || '',
        action: action,
        localTimestamp: Utils.getTimestamp(),
        extras: params
      };

      console.log('Custom Event!', event);

      Meteor.apply('storeCustomEvent', [ event ], { noRetry: true }, (err, res) => {
        if (!err) {
          msg = 'Custom Event stored sucessfully';
          typeof callback === 'function' && callback(null, msg);
        }
        else {
          msg = 'Error while saving Custom Event!';
          console.error(msg, action, err);
          typeof callback === 'function' && callback(err);
        }
      });
    }
    else {
      msg = 'Error while saving Custom Event!';
      console.error(msg, action);
      typeof callback === 'function' && callback(msg);
    }
  }
}