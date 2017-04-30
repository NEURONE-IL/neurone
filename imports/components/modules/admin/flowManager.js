import Utils from '../../globalUtils';
import Configs from '../../globalConfigs';

import template from './flowManager.html';

class FlowManager {
  constructor() {
    'ngInject';

    console.log('FlowManager loaded!');
  }
}

const name = 'flowManager';

export default angular.module(name, [
])
.component(name, {
  template,
  controllerAs: name,
  controller: FlowManager
});