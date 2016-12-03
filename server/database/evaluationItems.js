import { Meteor } from 'meteor/meteor';

import Utils from '../lib/utils';

import { FormAnswers } from '../../imports/api/formAnswers/index';
import { FormQuestions } from '../../imports/api/formQuestions/index';
import { FormQuestionnaires } from '../../imports/api/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/api/synthesisQuestions/index';
import { SynthesisAnswers } from '../../imports/api/synthesisAnswers/index';

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
    check(jsonObject, Object);

    var time = Utils.getTimestamp();
    jsonObject.serverTimestamp = time;

    var currentAnswer = SynthesisAnswers.findOne({ userId: this.userId, questionId: jsonObject.questionId, completeAnswer: false });

    if (Utils.isEmptyObject(currentAnswer)) {
      SynthesisAnswers.insert(jsonObject);
    }
    else {
      SynthesisAnswers.update(currentAnswer, {$set: {answer: jsonObject.answer, localTimestamp: jsonObject.localTimestamp, serverTimestamp: jsonObject.serverTimestamp, completeAnswer: jsonObject.completeAnswer}});
    }

    //console.log('Synthesis Answer Stored!', questionId, time);
    return jsonObject;
  }
});