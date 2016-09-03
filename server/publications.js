Meteor.publish('docSearch', function(searchText) {
  var doc = {};
  var documentIds = searchDocuments(searchText);
  if (documentIds) {
    doc._id = {
      $in: documentIds
    };
  }
  return Documents.find(doc);
});