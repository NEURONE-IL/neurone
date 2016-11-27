import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';

// dgacitua: API logic definitions
//import '../server/database/eventLogs';

// dgacitua: Database definitions
/*
import { Snippets } from '../imports/api/snippets/index';
import { Queries } from '../imports/api/queries/index';
import { Bookmarks } from '../imports/api/bookmarks/index';
import { VisitedLinks } from '../imports/api/visitedLinks/index';
import { SessionLogs } from '../imports/api/sessionLogs/index';
import { EventLogs } from '../imports/api/eventLogs/index';
*/

if (Meteor.isClient) {
  describe('Client API', function() {
    describe('ping()', function() {
      it('should return ping', function(done) {
        Meteor.call('ping', (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');
            done();
          }
          else {
            done(err);
          }
        });
      });
    });
    /*
    describe('storeSnippet()', function() {
      it('should store a Snippet', function(done) {
        var snippetObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          snippedText: 'My snipped text',
          title: 'NEURONE',
          url: '/home',
          localTimestamp: 1480200315688
        }

        Meteor.call('storeSnippet', snippetObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var snippet = Snippets.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(snippet, 'a Snippet is saved');
            chai.assert.property(snippet, '_id', 'stored Snippet has a valid id');

            var event = EventLogs.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(event, 'an Event is saved');
            chai.assert.property(event, '_id', 'stored Event has a valid id');
            chai.assert.propertyVal(event, 'action', 'Snippet', 'stored Event has a valid event action');
            chai.assert.propertyVal(event, 'actionId', snippet._id, 'stored Event has the correct Snippet id');

            done();
          }
          else {
            done(err);
          }
        });
      });
    });
    */
  });  
}
