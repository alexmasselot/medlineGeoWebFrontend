import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';

export default {
  citationLocatedCountByHexagon(radius, year) {
    console.log('calling ACTION_CITATION_LOCATED_COUNT_BY_HEXAGON', radius, year);
    dispatcher.dispatch({
      action:{type:Constants.ACTION_CITATION_LOCATED_COUNT_BY_HEXAGON},
      radius:radius,
      year:year
    })

  },

  clearList() {
    console.warn('clearList action not yet implemented...');
  },

  completeTask(task) {
    console.warn('completeTask action not yet implemented...');
  }
};
