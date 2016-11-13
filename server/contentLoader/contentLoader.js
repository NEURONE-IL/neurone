import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';

import { FormQuestions } from '../../imports/api/formQuestions/index';
import { FormQuestionnaires } from '../../imports/api/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/api/synthesisQuestions/index';

export default class ContentLoader {
  static loadQuestions(assetPath) {
    glob(path.join(assetPath, 'questions', '*.json'), Meteor.bindEnvironment((err, files) => {
      if (!err) {
        var total = files.length;

        files.forEach((file, idx) => {
          console.log('Reading question file!', (idx+1) + ' of ' + total);
          var questionFile = fs.readFileSync(file),
           loadedQuestions = JSON.parse(questionFile);          

          loadedQuestions.forEach((q) => {
            // TODO Question syntax checker
            if (q.questionId) {
              FormQuestions.upsert({ questionId: q.questionId }, q);
            }
            else if (q.questionnaireId) {
              FormQuestionnaires.upsert({ questionnaireId: q.questionnaireId }, q);
            }
            else if (q.synthesisId) {
              SynthesisQuestions.upsert({ synthesisId: q.synthesisId }, q);
            }
            else {
              console.warn('Wrong question format detected in object');
            }
          });
        });
      }
      else {
        console.error('Error while loading questions!', err);
      }
    }));
  }
}