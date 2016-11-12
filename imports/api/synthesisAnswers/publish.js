import { Meteor } from 'meteor/meteor';
import { SynthesisAnswers } from './collection';

if (Meteor.isServer) {
  Meteor.publish('synthesisAnswers', function() {
    /*
    const selector = { $and: [
      { owner: this.userId }, { owner: { $exists: true } }
    ]};
    */
    
    return SynthesisAnswers.find({});
  });
}

