import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// dgacitua: Utilities
import User from './utils/user';

describe('NEURONE API Admin Module', function() {
  if (Meteor.isClient) {
    // dgacitua: Reset database and login as Researcher
    beforeEach(function(done) {
      User.mockResearcher((err, res) => {
        if (!err) {
          console.log('Logged in as', res.username, Meteor.userId());
          done();
        }
        else {
          done(err);
        }
      });
    });

    afterEach(function(done) {
      User.logout((err, res) => {
        if (!err) {
          resetDatabase();
          done();
        } 
        else {
          done(err);
        }
      });
    });

    describe('listAllDocuments()', function() {
      it('list all documents on NEURONE', function(done) {
        Meteor.call('listAllDocuments', (err, res) => {
          if (!err) {
            chai.assert.isArray(res, 'a response with documents is delivered');
            done();
          }
          else {
            done(err);
          }
        });
      });
    });
  }
});