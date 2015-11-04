import assign from 'object-assign';
import Constants from '../constants/Constants';
import {EventEmitter} from 'events';

export default assign({}, EventEmitter.prototype, {

  _countListener:0,

  countListener(){
    return this._countListener;
  },

  // Allow Controller-View to register itself with store
  addChangeListener(callback) {
    this._countListener++;
    this.on(Constants.CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this._countListener--;
    this.removeListener(Constants.CHANGE_EVENT, callback);
  },

  // triggers change listener above, firing controller-view callback
  emitChange() {
    this.emit(Constants.CHANGE_EVENT);
  }
});
