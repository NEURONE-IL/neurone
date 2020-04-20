import MultimediaDownloader from '../multimediaIndexer/multimediaDownloader';

Meteor.methods({
  
  fetchMultimedia: function(documentObj) {
    try {
      if (this.userId) {
        
        check(documentObj, Object);

        let asyncCall = Meteor.wrapAsync(MultimediaDownloader.indexMultimedia),
                fetch = asyncCall(documentObj);  
        return fetch;
      }
      else {
        throw new Meteor.Error(599, 'User is not logged in!');
      }
    }
    catch (err) {
      throw new Meteor.Error(573, 'The server cannot fetch document from web', err);
    }
  },
  previewMultimedia: function(documentObj) {
    try {
      if (this.userId) {
        check(documentObj, Object);

        let asyncCall = Meteor.wrapAsync(MultimediaDownloader.preview),
              preview = asyncCall(documentObj);

        return preview;
      }
      else {
        throw new Meteor.Error(599, 'User is not logged in!');
      }
    }
    catch (err) {
      throw new Meteor.Error(573, 'The server cannot preview document from web', err);
    }
  },
  deleteFile: function(obj) {
    try {
      if (this.userId) {
        return MultimediaDownloader.deleteFile(obj)
      }
      else {
        throw new Meteor.Error(599, 'User is not logged in!');
      }
    }
    catch (err) {
      throw new Meteor.Error(573, 'ERR delete', err);
    }
  },
  listAllMultimedia: function(obj) {
    try {
      if (this.userId) {
        return MultimediaDownloader.listAll(obj);
      }
      else {
        throw new Meteor.Error(599, 'User is not logged in!');
      }
    }
    catch (err) {
      throw new Meteor.Error(574, 'Cannot list all documents', err);
    }
  }
});
