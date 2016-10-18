import { Mongo } from 'meteor/mongo';

export const FormAnswers = new Mongo.Collection('formanswers');

FormAnswers.allow({
  insert(userId, ans) {
    return userId && ans.owner === userId;
  },
  update(userId, ans, fields, modifier) {
    return userId && ans.owner === userId;
  },
  remove(userId, ans) {
    return userId && ans.owner === userId;
  }
});
