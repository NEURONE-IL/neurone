import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './studyManager.html';

class StudyManager {
  constructor() {
    'ngInject';

    console.log('StudyManager loaded!');
  }
}

const name = 'studyManager';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: StudyManager
});