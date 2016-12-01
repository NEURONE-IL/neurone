import chai from 'chai';
import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// dgacitua: Database definitions
import { Snippets } from '../imports/api/snippets/index';
import { Queries } from '../imports/api/queries/index';
import { Bookmarks } from '../imports/api/bookmarks/index';
import { VisitedLinks } from '../imports/api/visitedLinks/index';
import { SessionLogs } from '../imports/api/sessionLogs/index';
import { EventLogs } from '../imports/api/eventLogs/index';

describe('NEURONE API', function() {
  if (Meteor.isClient) {
    // dgacitua: Testing case
    describe('ping()', function() {
      it('should return succesful ping', function(done) {
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
  }
  
  if (Meteor.isServer) {
    // dgacitua: Reset database
    beforeEach(function() {
      resetDatabase();
    });

    // dgacitua: Test snippets
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
            chai.assert.propertyVal(snippet, 'snippedText', snippetObject.snippedText, 'stored Snippet has the correct text');

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

    // dgacitua: Test queries
    describe('storeQuery()', function() {
      it('should store a Query', function(done) {
        var queryObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          query: 'tokyo olympics',
          title: 'NEURONE',
          url: '/home',
          localTimestamp: 1480200315688
        }

        Meteor.call('storeQuery', queryObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var query = Queries.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(query, 'a Query is saved');
            chai.assert.property(query, '_id', 'stored Query has a valid id');
            chai.assert.propertyVal(query, 'query', queryObject.query, 'stored Query has the correct text');

            var event = EventLogs.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(event, 'an Event is saved');
            chai.assert.property(event, '_id', 'stored Event has a valid id');
            chai.assert.propertyVal(event, 'action', 'Query', 'stored Event has a valid event action');
            chai.assert.propertyVal(event, 'actionId', query._id, 'stored Event has the correct Query id');

            done();
          }
          else {
            done(err);
          }
        });
      });
    });

    // dgacitua: Test session logs
    describe('storeSessionLog()', function() {
      it('should store a Session Log', function(done) {
        var sessionObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          state: 'Login',
          localTimestamp: 1480200315688
        };

        Meteor.call('storeSessionLog', sessionObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var session = SessionLogs.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(session, 'a Session is saved');
            chai.assert.property(session, '_id', 'stored Session has a valid id');
            chai.assert.propertyVal(session, 'state', sessionObject.state, 'stored Session has the correct text');

            var event = EventLogs.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(event, 'an Event is saved');
            chai.assert.property(event, '_id', 'stored Event has a valid id');
            chai.assert.propertyVal(event, 'action', sessionObject.state, 'stored Event has a valid event action');
            chai.assert.propertyVal(event, 'actionId', session._id, 'stored Event has the correct Session id');

            done();
          }
          else {
            done(err);
          }
        });
      });
    });

    // dgacitua: Test visited links
    describe('storeVisitedLink()', function() {
      it('should store a Visited Link', function(done) {
        var linkObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          state: 'PageEnter',
          title: 'NEURONE',
          url: '/home',
          localTimestamp: 1480200315688
        };

        Meteor.call('storeVisitedLink', linkObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var link = VisitedLinks.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(link, 'a Link is saved');
            chai.assert.property(link, '_id', 'stored Link has a valid id');
            chai.assert.propertyVal(link, 'url', linkObject.url, 'stored Link has the correct text');

            var event = EventLogs.findOne({}, {sort: {DateTime: -1, limit: 1}});
            chai.assert.isObject(event, 'an Event is saved');
            chai.assert.property(event, '_id', 'stored Event has a valid id');
            chai.assert.propertyVal(event, 'action', linkObject.state, 'stored Event has a valid event action');
            chai.assert.propertyVal(event, 'actionId', link._id, 'stored Event has the correct Link id');

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