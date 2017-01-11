import { name as Instructions } from './templates/instructions';
import { name as Demo } from './templates/demo';
import { name as Stage0 } from './templates/stage0';
import { name as Stage1 } from './templates/stage1';
import { name as Stage2 } from './templates/stage2';
import { name as Stage3 } from './templates/stage3';

class Stages {}

const name = 'stages';

// create a module
export default angular.module(name, [
  Instructions,
  Demo,
  Stage0,
  Stage1,
  Stage2,
  Stage3
])
.component(name, {
  controllerAs: name,
  controller: Stages
});