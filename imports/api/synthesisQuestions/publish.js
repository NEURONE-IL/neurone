import { Meteor } from 'meteor/meteor';
import { SynthesisQuestions } from './collection';

if (Meteor.isServer) {
  Meteor.publish('synthesisQuestions', function() {
    /*
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    */
    
    return SynthesisQuestions.find({});
  });
}

