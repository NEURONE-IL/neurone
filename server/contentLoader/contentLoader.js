import fs from 'fs';
import path from 'path';
import glob from 'glob';

import Utils from '../lib/utils';

import { FormQuestions } from '../../imports/database/formQuestions/index';
import { FormQuestionnaires } from '../../imports/database/formQuestionnaires/index';
import { SynthesisQuestions } from '../../imports/database/synthesisQuestions/index';
import { Settings } from '../../imports/database/settings/index';

export default class ContentLoader {
  static loadQuestions(assetPath) {
    let fullPath = path.join(assetPath, 'questions', '*.json');

    if (fs.existsSync(fullPath)) {
      glob(fullPath, Meteor.bindEnvironment((err, files) => {
        if (!err) {
          var total = files.length;

          files.forEach((file, idx, arr) => {
            var fn = path.basename(file);
            console.log('Reading question file!', '[' + (idx+1) + '/' + total + ']', fn);

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

            if (idx === arr.length-1) return true;
          });
        }
        else {
          console.error('Error while loading questions!', err);
          return false;
        }
      }));
    }
    else {
      return true;
    }
  }

  static loadSettings(assetPath) {
    let fullPath = path.join(assetPath, 'userSettings.json');

    if (fs.existsSync(fullPath)) {
      glob(fullPath, Meteor.bindEnvironment((err, files) => {
        if (!err) {
          var total = files.length;

          files.forEach((file, idx, arr) => {
            var fn = path.basename(file);
            console.log('Reading settings file!', '[' + (idx+1) + '/' + total + ']', fn);

            var settingsFile = fs.readFileSync(file),
              loadedSettings = JSON.parse(settingsFile);          

            loadedSettings.forEach((s) => {
              // TODO Config syntax checker
              if (s.userSettingsId) {
                Settings.upsert({ userSettingsId: s.userSettingsId }, s);
              }
              else if (s.envSettingsId) {
                Settings.upsert({ envSettingsId: s.envSettingsId }, s);
              }
              else {
                console.warn('Wrong settings format detected in object');
              }
            });

            if (idx === arr.length-1) return true;
          });
        }
        else {
          console.error('Error while loading settings!', err);
          return false;
        }
      }));
    }
    else {
      return true;
    }
  }
}