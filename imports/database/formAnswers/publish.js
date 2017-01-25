import { Meteor } from 'meteor/meteor';
import { FormAnswers } from './collection';

if (Meteor.isServer) {
  Meteor.publish('formAnswers', function() {
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
 
    return FormAnswers.find({});
  });
}

