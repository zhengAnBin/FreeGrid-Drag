import Utils from '../../utils/utils';
import defaults from './defaults';

class Drag extends DragClass {
  constructor(...args) {
    let el;
    let params;
    [el, params] = args;
    if (!params) params = {};
    super(params);

    const drag = this;
    drag.params = Utils.extend(defaults, params);

    drag.init();
  }
  init(){
    
  }
}