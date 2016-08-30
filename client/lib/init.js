import { Meteor } from 'meteor/meteor';

import './linktrack.js';
import './kmtrack.js';

Meteor.startup(() => {
  KMTrack.init();
});