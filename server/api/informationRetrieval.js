import { Meteor } from 'meteor/meteor';

import Utils from '../utils/serverUtils';

import { Documents, Queries, Bookmarks, Snippets, UserData } from '../database/definitions';

// NEURONE API: Information Retrieval
// Methods for getting information on document, bookmark and snippet status for the user

Meteor.methods({
  // dgacitua: Get latest snippets from user
  //           PARAMS: limit (OPTIONAL: Number of snippets)
  //           RETURNS: Snippet JSON array
  getSnippets: function(limit) {
    try {
      var selector = { sort: { serverTimestamp: -1 }};  // Build a sort selector for MongoDB
      if (limit) selector.limit = limit;                // Apply limit, if it exists
        
      // Search all snippets for the userId making the request, using the selector
      return Snippets.find({ userId: this.userId, action: 'Snippet' }, selector).fetch();
    }
    catch (err) {
      // Return a Meteor Error if something fails
      throw new Meteor.Error(541, 'Could not read Snippets from Database!', err);
    }
  },
  // dgacitua: Get latest bookmarks from user
  //           PARAMS: limit (OPTIONAL: Number of snippets)
  //           RETURNS: Bookmark JSON array
  getBookmarks: function(limit) {
    try {
      var selector = { sort: { serverTimestamp: -1 }};

      // dgacitua: https://coderwall.com/p/o9np9q/get-unique-values-from-a-collection-in-meteor
      var bms = _.uniq(Bookmarks.find({ userId: this.userId, action: 'Bookmark' }, selector).fetch(), (x) => { return x.url });

      if (limit) return bms.slice(-(limit));
      else return bms;
    }
    catch (err) {
      throw new Meteor.Error(542, 'Could not read Bookmarks from Database!', err);
    }
  },
  // dgacitua: Check if current viewed document is bookmarked by user
  //           PARAMS: currentUrl (URL string)
  //           RETURNS: <boolean>
  isBookmark: function(currentUrl) {
    check(currentUrl, String);

    try {
      var bkm = Bookmarks.findOne({ userId: this.userId, url: currentUrl },  { sort: { serverTimestamp: -1 }});

      if (bkm && bkm.action === 'Bookmark') return true;
      else return false;
    }
    catch (err) {
      throw new Meteor.Error(543, 'Could not read Bookmark Status from Database!', err);
    }
  },
  // dgacitua: Get documents marked as relevant for a user session
  //           PARAMS: <none>
  //           RETURNS: Document JSON array
  getRelevantDocuments: function() {
    try {
      if (this.userId) {
        var user = UserData.findOne({ userId: this.userId }),
           limit = user.configs.maxBookmarks,
           topic = user.configs.topic,
            test = user.configs.test,
            docs = Documents.find({ topic: topic, test: test, relevant: true }, { limit: limit }).fetch();

        return docs;
      }
      else {
        return Documents.find({ relevant: true }).fetch();
      }
    }
    catch (err) {
      throw new Meteor.Error(544, 'Could not get Relevant Documents from Database!', err);
    }
  },
  // dgacitua: Get bookmark score based on iFuCo's Performance Formula
  //           PARAMS: <none>
  //           RETURNS: Score object
  getBookmarkScore: function() {
    try {
      if (this.userId) {
        var user = UserData.findOne({userId: this.userId}),
           limit = user.configs.maxBookmarks,
        maxStars = user.configs.maxStars;

        var pipe1 = [
                      { $match: { userId: this.userId, userMade: true }},
                      { $sort: { serverTimestamp: -1 }},
                      { $group: { _id: '$docId', originalId: {$first: '$_id'}, userId: {$first: '$userId'}, title: {$first: '$title'}, action: {$first: '$action'}, relevant: {$first: '$relevant'}, url: {$first: '$url'}, userMade: {$first: '$userMade'}}},
                      { $project: { _id: '$originalId', docId: '$_id', userId: '$userId', title: '$title', action: '$action', relevant: '$relevant', url: '$url', userMade: '$userMade'}},
                      { $match: { action: 'Bookmark', relevant: true }}
                    ];

        var pipe2 = [
                      { $match: { userId: this.userId, userMade: true }},
                      { $sort: { serverTimestamp: -1 }},
                      { $group: { _id: '$docId', originalId: {$first: '$_id'}, userId: {$first: '$userId'}, title: {$first: '$title'}, action: {$first: '$action'}, relevant: {$first: '$relevant'}, url: {$first: '$url'}, userMade: {$first: '$userMade'}}},
                      { $project: { _id: '$originalId', docId: '$_id', userId: '$userId', title: '$title', action: '$action', relevant: '$relevant', url: '$url', userMade: '$userMade'}},
                      { $match: { action: 'Bookmark' }}
                    ];

        // dgacitua: From 'meteorhacks:aggregate' Meteor package
        var relevantCollectedPages = parseFloat(Bookmarks.aggregate(pipe1).length)
           totalCollectedBookmarks = Bookmarks.aggregate(pipe2).length > 0 ? parseFloat(Bookmarks.aggregate(pipe2).length) : 1.0,
                             score = relevantCollectedPages/totalCollectedBookmarks,
                          stdScore = score*maxStars,
                          rndScore = Math.round(stdScore);

        // TODO: Update score formula from iFuCo Research Team

        return {
          score: score,
          stdScore: stdScore,
          rndScore: rndScore,
          relevantBookmarks: relevantCollectedPages,
          totalBookmarks: totalCollectedBookmarks
        };
      }
      else {
        return null;
      }
    }
    catch (err) {
      throw new Meteor.Error(545, 'Could not get Bookmark Score from Database!', err);
    }
  }
});

Meteor.publish({
  // dgacitua: Get user bookmarks as a Meteor reactive source
  userBookmarks: function() {
    if (this.userId) {
      var user = UserData.findOne({ userId: this.userId }),
         limit = user.configs.maxBookmarks || 1,
          pipe = [
                  { $match: { userId: this.userId }},
                  { $sort: { serverTimestamp: -1 }},
                  { $group: { _id: '$docId', originalId: {$first: '$_id'}, userId: {$first: '$userId'}, title: {$first: '$title'}, action: {$first: '$action'}, relevant: {$first: '$relevant'}, url: {$first: '$url'}}},
                  { $project: { _id: '$originalId', docId: '$_id', userId: '$userId', title: '$title', action: '$action', relevant: '$relevant', url: '$url'}},
                  { $match: { action: 'Bookmark' }},
                  { $limit: limit }
                ];

      // dgacitua: From 'jcbernack:reactive-aggregate' Meteor package
      ReactiveAggregate(this, Bookmarks, pipe, { clientCollection: 'UserBookmarks' });
    }
    else {
      this.ready();
    }
  },
  // dgacitua: Get user snippets as a Meteor reactive source
  userSnippets: function() {
    if (this.userId) {
      // dgacitua: http://stackoverflow.com/a/40266075
      var user = UserData.findOne({ userId: this.userId }),
         limit = user.configs.maxSnippetsPerPage || 1,
          pipe = [
                  { $match: { userId: this.userId }},
                  { $sort: { serverTimestamp: -1 }},
                  { $group: { _id: '$snippetId', originalId: {$first: '$_id'}, userId: {$first: '$userId'}, title: {$first: '$title'}, action: {$first: '$action'}, snippedText: {$first: '$snippedText'}, url: {$first: '$url'}, docId: {$first: '$docId' }, serverTimestamp: { $first: '$serverTimestamp' }}},
                  { $project: { _id: '$originalId', snippetId: '$_id', userId: '$userId', title: '$title', action: '$action', snippedText: '$snippedText', url: '$url', docId: '$docId', serverTimestamp: '$serverTimestamp' }},
                  { $sort: { serverTimestamp: -1 }},
                  { $match: { action: 'Snippet' }},
                  { $group: { _id: '$docId', doc: { $push: { originalId: '$_id', snippetId: '$snippetId', userId: '$userId', title: '$title', action: '$action', snippedText: '$snippedText', url: '$url', docId: '$docId', serverTimestamp: '$serverTimestamp' }}}},
                  { $project: { snippets: { $slice: ['$doc', limit] }}},
                  { $unwind: { path: '$snippets' }},
                  { $project: { _id: '$snippets.originalId', docId: '$_id', userId: '$snippets.userId', snippetId: '$snippets.snippetId', snippedText: '$snippets.snippedText', title: '$snippets.title', action: '$snippets.action', url: '$snippets.url', serverTimestamp: '$snippets.serverTimestamp' }},
                  { $sort: { serverTimestamp: 1 }}
                ];

      // dgacitua: From 'jcbernack:reactive-aggregate' Meteor package
      ReactiveAggregate(this, Snippets, pipe, { clientCollection: 'UserSnippets' });
    }
    else {
      this.ready();
    }
  }
});