import { Meteor } from 'meteor/meteor';

import Utils from '../lib/utils';

import { EventLogs } from '../../imports/database/eventLogs/index';

import { FormAnswers } from '../../imports/database/formAnswers/index';
import { FormQuestions } from '../../imports/database/formQuestions/index';
import { FormQuestionnaires } from '../../imports/database/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/database/synthesisQuestions/index';
import { SynthesisAnswers } from '../../imports/database/synthesisAnswers/index';

const synthesisAnswerPattern = { userId: String, username: String, startTime: Number, questionId: Match.OneOf(Number, String), question: String, answer: String, completeAnswer: Boolean, localTimestamp: Number };
Meteor.methods({
  getForm: function(formId) {
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
  },
  storeFormAnswer: function(jsonObject) {
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    FormAnswers.insert(jsonObject);
    //console.log('Form Answer Stored!', page, time);
    return jsonObject;
  },
  getSynthQuestion: function(synthId) {
    check(synthId, Match.OneOf(Number, String));
    
    //var mock = { synthesisId: 'syn1', question: 'Is this a question?' };

    return SynthesisQuestions.findOne({ synthesisId: synthId });
  },
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
      //return SynthesisAnswers.findOne({ userId: this.userId, questionId: synthId, completeAnswer: false });
    }
    catch (err) {
      throw new Meteor.Error('DatabaseError', 'Could not load Synthesis Answer in Database!', err);
    }
  },
  storeSynthesisAnswer: function(jsonObject) {
    try {
      check(jsonObject, synthesisAnswerPattern);

      var time = Utils.getTimestamp();
      jsonObject.serverTimestamp = time;

      var answerId = SynthesisAnswers.insert(jsonObject);

      if (jsonObject.completeAnswer) {
        var action = {
          userId: jsonObject.userId,
          username: jsonObject.username,
          action: 'SynthesisAnswer',
          actionId: answerId,
          clientDate: Utils.timestamp2date(jsonObject.localTimestamp),
          clientTime: Utils.timestamp2time(jsonObject.localTimestamp),
          clientTimestamp: jsonObject.localTimestamp,
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
      throw new Meteor.Error('DatabaseError', 'Could not save Synthesis Answer in Database!', err);
    }
  }
});