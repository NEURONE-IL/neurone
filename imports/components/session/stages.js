import { name as Instructions } from './stages/instructions';
import { name as Stage0 } from './stages/stage0';
import { name as Stage1 } from './stages/stage1';
import { name as Stage2 } from './stages/stage2';
import { name as Stage3 } from './stages/stage3';

class Stages {}

const name = 'stages';

// create a module
export default angular.module(name, [
  Instructions,
  Stage0,
  Stage1,
  Stage2,
  Stage3
])
.component(name, {
  controllerAs: name,
  controller: Stages
});