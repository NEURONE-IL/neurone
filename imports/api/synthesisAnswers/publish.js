import { Meteor } from 'meteor/meteor';
import { SynthesisAnswers } from './collection';

if (Meteor.isServer) {
  Meteor.publish('synthesisAnswers', function() {
    /*
    const selector = { $and: [
      { userId: this.userId }, { userId: { $exists: true } }
    ]};
    */
    
    return SynthesisAnswers.find({});
  });
}

