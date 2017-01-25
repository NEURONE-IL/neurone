import { Mongo } from 'meteor/mongo';

export const FormQuestionnaires = new Mongo.Collection('formquestionnaires');

FormQuestionnaires.allow({
  insert(userId, fqs) {
    return userId && fqs.userId === userId;
  },
  update(userId, fqs, fields, modifier) {
    return userId && fqs.userId === userId;
  },
  remove(userId, fqs) {
    return userId && fqs.userId === userId;
  }
});
