import { Meteor } from 'meteor/meteor';
import { FormQuestionnaires } from './collection';

if (Meteor.isServer) {
  Meteor.publish('formQuestionnaires', function() {
    /*
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    */
    
    return FormQuestionnaires.find({});
  });
}

