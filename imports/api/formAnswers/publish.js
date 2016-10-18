import { Meteor } from 'meteor/meteor';
import { FormAnswers } from './collection';

if (Meteor.isServer) {
  Meteor.publish('formAnswers', function() {
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
 
    return FormAnswers.find({});
  });
}

