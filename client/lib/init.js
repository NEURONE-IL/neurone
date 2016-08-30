import { Meteor } from 'meteor/meteor';

import './configs.js';
import './linktrack.js';
import './kmtrack.js';

Meteor.methods({
  'takeSnippet': function(){
    getSnippet();
  }
});

Meteor.startup(() => {
  KMTrack.init();
});