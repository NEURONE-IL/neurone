import ServerUtils from '../lib/utils';

import { FormAnswers } from '../../imports/api/formAnswers/index';
import { FormQuestions } from '../../imports/api/formQuestions/index';
import { FormQuestionnaires } from '../../imports/api/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/api/synthesisQuestions/index';
import { SyhtiesisAnswers } from '../../imports/api/synthesisAnswers/index';

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

    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;

    FormAnswers.insert(jsonObject);
    //console.log('Form Answer Stored!', page, time);
    return true;
  },
  getSynthQuestion: function(synthId) {
    check(synthId, Match.OneOf(Number, String));

    return SynthesisQuestions.findOne({ questionId: synthId });
  },
  storeSynthesisAnswer: function(jsonObject) {
    check(jsonObject, Object);

    var time = ServerUtils.getTimestamp();
    jsonObject.server_time = time;

    SynthesisAnswers.insert(jsonObject);
    //console.log('Form Answer Stored!', page, time);
    return true;
  }
});