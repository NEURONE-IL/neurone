import { Meteor } from 'meteor/meteor';
import { Documents } from './collection';

if (Meteor.isServer) {
  Meteor.publish('documents', function() {
    const selector = {
      $or: [{
        // the public documents
        $and: [{
          public: true
        }, {
          public: {
            $exists: true
          }
        }]
      }, {
        // when logged in user is the owner
        $and: [{
          owner: this.userId
        }, {
          owner: {
            $exists: true
          }
        }]
      }]
    };
 
    return Documents.find({});
  });

  Meteor.publish('documentDetails', function() {
    return Documents.find({});
  });
}

