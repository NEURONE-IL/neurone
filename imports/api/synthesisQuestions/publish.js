import { Meteor } from 'meteor/meteor';
import { SynthesisQuestions } from './collection';

if (Meteor.isServer) {
  Meteor.publish('synthesisQuestions', function() {
    /*
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    */
    
    return SynthesisQuestions.find({});
  });
}

