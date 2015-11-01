import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';

export default {
  citationLocatedCountByHexagon(radius, year) {
    dispatcher.dispatch({
      action:{type:Constants.ACTION_CITATION_LOCATED_COUNT_BY_HEXAGON},
      radius:radius,
      year:year
    })

  },

  selectYear(year){
      dispatcher.dispatch({
        action:{type:Constants.ACTION_YEAR_SELECTED},
        year:year
      })
  },



};
