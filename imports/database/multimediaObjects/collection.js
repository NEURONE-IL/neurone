import { Mongo } from 'meteor/mongo';

export const Video = new Mongo.Collection('Video');

export const Book = new Mongo.Collection('Book');

export const ImageSearch = new Mongo.Collection('ImageSearch');


ImageSearch.allow({
  insert(userId, doc) {
    return userId;
  },
  update(userId, doc, fields, modifier) {
    return userId;
  },
  remove(userId, doc) {
    return userId;
  }
});

Book.allow({
  insert(userId, doc) {
    return userId;
  },
  update(userId, doc, fields, modifier) {
    return userId;
  },
  remove(userId, doc) {
    return userId;
  }
})

Video.allow({
  insert(userId, doc) {
    return userId;
  },
  update(userId, doc, fields, modifier) {
    return userId;
  },
  remove(userId, doc) {
    return userId;
  }
});