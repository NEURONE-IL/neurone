import { Meteor } from 'meteor/meteor';

import Utils from '../lib/utils';

import { EventLogs } from '../../imports/api/eventLogs/index';

import { FormAnswers } from '../../imports/api/formAnswers/index';
import { FormQuestions } from '../../imports/api/formQuestions/index';
import { FormQuestionnaires } from '../../imports/api/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/api/synthesisQuestions/index';
import { SynthesisAnswers } from '../../imports/api/synthesisAnswers/index';

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
    check(synthId, Match.OneOf(Number, String));
    
    /*
    var mock = {
      userId: 'rpcvcnxGJDLqLrsut',
      username: 'asdf@asdf.com',
      startTime: 1479061295951,
      questionId: 'syn1',
      question: 'Is this a question?',
      answer: '<b>No</b>',
      completeAnswer: false,
      localTimestamp: 1479061296951
    };
    */

    return SynthesisAnswers.findOne({ userId: this.userId, questionId: synthId, completeAnswer: false });
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