import { Meteor } from 'meteor/meteor';
import { FormQuestionnaires } from './collection';

if (Meteor.isServer) {
  Meteor.publish('formQuestionnaires', function() {
    /*
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    */
    
    return FormQuestionnaires.find({});
  });
}

