import { name as Instructions } from './templates/instructions';
import { name as Tutorial } from './templates/tutorial';
import { name as Stage0 } from './templates/stage0';
import { name as Search } from './templates/search';
import { name as Collection } from './templates/collection';
import { name as CriticalEval } from './templates/criticalEval';
import { name as Synthesis } from './templates/synthesis';

class Stages {}

const name = 'stages';

// create a module
export default angular.module(name, [
  Instructions,
  Tutorial,
  //Stage0,
  Search,
  Collection,
  CriticalEval,
  Synthesis
])
.component(name, {
  controllerAs: name,
  controller: Stages
});