import { Meteor } from 'meteor/meteor';

import Utils from '../utils/serverUtils';

import { EventLogs } from '../../imports/database/eventLogs/index';

import { FormAnswers } from '../../imports/database/formAnswers/index';
import { FormQuestions } from '../../imports/database/formQuestions/index';
import { FormQuestionnaires } from '../../imports/database/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/database/synthesisQuestions/index';
import { SynthesisAnswers } from '../../imports/database/synthesisAnswers/index';

// NEURONE API: Evaluation Items
// Methods for saving and loading forms, synthesis and answers are described here

const synthesisAnswerPattern = { userId: String, username: String, startTime: Number, questionId: Match.OneOf(Number, String), question: String, answer: String, completeAnswer: Boolean, localTimestamp: Number };

Meteor.methods({
  // dgacitua: Method for getting a dynamic form from questions and questionnaires
  //           PARAMS: formId (ID in database for the questionnaire)
  //           RETURNS: form (NEURONE form with the questions from database, in JSON format)
  getForm: function(formId) {
    try {
      check(formId, Match.OneOf(Number, String));

      var questionnaire = FormQuestionnaires.findOne({ questionnaireId: formId }),
                   form = {};

      if (questionnaire) {
        form.formId = questionnaire.questionnaireId;
        form.instructions = questionnaire.instructions;
        form.questions = [];

        questionnaire.questions.forEach((q) => {
          var question = FormQuestions.findOne({ questionId: q });
          if (question) form.questions.push(question);
        });
      }

      return form;
    }
    catch (err) {
      throw new Meteor.Error(561, 'Could not load Synthesis Answer in Database!', err);
    }
  },
  // dgacitua: Method for saving answers from NEURONE forms
  //           PARAMS: formAnswer (answer in JSON format)
  //           RETURNS: 'success' status object
  storeFormAnswer: function(formAnswer) {
    try {
      check(formAnswer, Object);

      var time = Utils.getTimestamp();
      formAnswer.serverTimestamp = time;

      FormAnswers.insert(formAnswer);
      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(562, 'Could not save Form Answer in Database!', err);
    }
  },
  // dgacitua: Method for getting synthesis question
  //           PARAMS: synthId (Synthesis ID in database)
  //           RETURNS: Synthesis question in JSON format
  getSynthQuestion: function(synthId) {
    try {
      check(synthId, Match.OneOf(Number, String));

      return SynthesisQuestions.findOne({ synthesisId: synthId });
    }
    catch (err) {
      throw new Meteor.Error(563, 'Could not load Synthesis Question in Database!', err);
    }
  },
  // dgacitua: Load latest saved synthesis question for a user
  //           PARAMS: synthId (Synthesis ID in database)
  //           RETURNS: Synthesis answer in JSON format
  getSynthesisAnswer: function(synthId) {
    try {
      check(synthId, Match.OneOf(Number, String));
      
      var pipeline = [
                      { $match: { userId: this.userId, questionId: synthId, completeAnswer: false }},
                      { $sort: { serverTimestamp: -1 }},
                      { $limit: 1 }
                    ];

      var docList = SynthesisAnswers.aggregate(pipeline),
           answer = docList.length > 0 ? docList[0] : { answer: '', startTime: Utils.getTimestamp() };

      return answer;
    }
    catch (err) {
      throw new Meteor.Error(564, 'Could not load Synthesis Answer in Database!', err);
    }
  },
  // dgacitua: Save synthesis answer in database, and creates a EventLogs record if it was the final (complete) answer
  //           PARAMS: synthAnswer (Synthesis answer in JSON format)
  //           RETURNS: 'success' status object
  storeSynthesisAnswer: function(synthAnswer) {
    try {
      check(synthAnswer, synthesisAnswerPattern);

      var time = Utils.getTimestamp();
      synthAnswer.serverTimestamp = time;

      var answerId = SynthesisAnswers.insert(synthAnswer);

      if (synthAnswer.completeAnswer) {
        var action = {
          userId: synthAnswer.userId,
          username: synthAnswer.username,
          action: 'SynthesisAnswer',
          actionId: answerId,
          clientDate: Utils.timestamp2date(synthAnswer.localTimestamp),
          clientTime: Utils.timestamp2time(synthAnswer.localTimestamp),
          clientTimestamp: synthAnswer.localTimestamp,
          serverDate: Utils.timestamp2date(time),
          serverTime: Utils.timestamp2time(time),
          serverTimestamp: time,
          ipAddr: (this.connection ? this.connection.clientAddress : ''),
          userAgent: (this.connection ? this.connection.httpHeaders['user-agent'] : ''),
          extras: ''
        };

        EventLogs.insert(action);
      }

      return { status: 'success' };
    }
    catch (err) {
      throw new Meteor.Error(565, 'Could not save Synthesis Answer in Database!', err);
    }
  }
});