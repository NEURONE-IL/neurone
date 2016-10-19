import { Meteor } from 'meteor/meteor';
import { FormQuestions } from './collection';

if (Meteor.isServer) {
  Meteor.publish('formQuestions', function() {
    /*
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    */
    
    return FormQuestions.find({});
  });
}

