import { Mongo } from 'meteor/mongo';

export const FormQuestionnaires = new Mongo.Collection('formquestionnaires');

FormQuestionnaires.allow({
  insert(userId, fqs) {
    return userId;
  },
  update(userId, fqs, fields, modifier) {
    return userId;
  },
  remove(userId, fqs) {
    return userId;
  }
});
