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
import { FormAnswers } from '../imports/api/formAnswers/index';
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
    describe('storeBookmark()', function() {
      it('should store a Bookmark', function(done) {
        var bookmarkObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          action: 'Bookmark',
          title: 'NEURONE',
          url: '/home',
          docId: 'L9R4iubjCgkQDywSh',
          rating: 5,
          reason: 'It\'s good',
          relevant: false,
          localTimestamp: 1480200315688
        }

        Meteor.call('storeBookmark', bookmarkObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var bookmark = Bookmarks.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(bookmark, 'a Bookmark is saved');
            chai.assert.property(bookmark, '_id', 'stored Bookmark has a valid id');
            chai.assert.propertyVal(bookmark, 'action', bookmarkObject.action, 'stored Bookmark has the correct text');

            var event = EventLogs.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(event, 'an Event is saved');
            chai.assert.property(event, '_id', 'stored Event has a valid id');
            chai.assert.propertyVal(event, 'action', 'Bookmark', 'stored Event has a valid event action');
            chai.assert.propertyVal(event, 'actionId', bookmark._id, 'stored Event has the correct Snippet id');

            done();
          }
          else {
            done(err);
          }
        });
      });
    });

    // dgacitua: Test snippets
    describe('storeSnippet()', function() {
      it('should store a Snippet', function(done) {
        var snippetObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          action: 'Snippet',
          snippetId: 0,
          snippedText: 'My snipped text',
          title: 'NEURONE',
          url: '/home',
          docId: 'L9R4iubjCgkQDywSh',
          localTimestamp: 1480200315688
        }

        Meteor.call('storeSnippet', snippetObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var snippet = Snippets.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(snippet, 'a Snippet is saved');
            chai.assert.property(snippet, '_id', 'stored Snippet has a valid id');
            chai.assert.propertyVal(snippet, 'snippedText', snippetObject.snippedText, 'stored Snippet has the correct text');

            var event = EventLogs.findOne({}, {sort: {serverTimestamp: -1}});
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

            var query = Queries.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(query, 'a Query is saved');
            chai.assert.property(query, '_id', 'stored Query has a valid id');
            chai.assert.propertyVal(query, 'query', queryObject.query, 'stored Query has the correct text');

            var event = EventLogs.findOne({}, {sort: {serverTimestamp: -1}});
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

            var session = SessionLogs.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(session, 'a Session is saved');
            chai.assert.property(session, '_id', 'stored Session has a valid id');
            chai.assert.propertyVal(session, 'state', sessionObject.state, 'stored Session has the correct text');

            var event = EventLogs.findOne({}, {sort: {serverTimestamp: -1}});
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

            var link = VisitedLinks.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(link, 'a Link is saved');
            chai.assert.property(link, '_id', 'stored Link has a valid id');
            chai.assert.propertyVal(link, 'url', linkObject.url, 'stored Link has the correct text');

            var event = EventLogs.findOne({}, {sort: {serverTimestamp: -1}});
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

    // dgacitua: Test form answers
    describe('storeFormAnswer()', function() {
      it('should store a Form Answer', function(done) {
        var responseObject = {
          userId: 'MQZMozeQfgDtxEgQr',
          username: 'test',
          action: 'FormResponse',
          reason: 'MyForm',
          answer: [],
          localTimestamp: 1480200315688
        };

        Meteor.call('storeFormResponse', responseObject, (err, res) => {
          if (!err) {
            chai.assert.isObject(res, 'a response is delivered');
            chai.assert.propertyVal(res, 'status', 'success', 'response is successful');

            var response = FormAnswers.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(response, 'a Form Response is saved');
            chai.assert.property(response, '_id', 'stored Form Response has a valid id');
            chai.assert.propertyVal(response, 'reason', responseObject.reason, 'stored FormResponse has the correct text');

            var event = EventLogs.findOne({}, {sort: {serverTimestamp: -1}});
            chai.assert.isObject(event, 'an Event is saved');
            chai.assert.property(event, '_id', 'stored Event has a valid id');
            chai.assert.propertyVal(event, 'action', responseObject.action, 'stored Event has a valid event action');
            chai.assert.propertyVal(event, 'actionId', response._id, 'stored Event has the correct Form Response id');

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

