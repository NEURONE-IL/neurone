import { Meteor } from 'meteor/meteor';
import { FormQuestions } from './collection';

if (Meteor.isServer) {
  Meteor.publish('formQuestions', function() {
    /*
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    */
    
    return FormQuestions.find({});
  });
}

