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

  countryCount(year) {
    dispatcher.dispatch({
      action:{type:Constants.ACTION_CITATION_LOCATED_COUNT_BY_COUNTRY},
      year:year
    })
  },

  countryPairsCount(year) {
    dispatcher.dispatch({
      action:{type:Constants.ACTION_CITATION_LOCATED_COUNT_BY_COUNTRY_PAIRS},
      year:year
    })
  },

  selectYear(year){
      dispatcher.dispatch({
        action:{type:Constants.ACTION_YEAR_SELECTED},
        year:year
      })
  },

  showCountryDetails(iso2) {
    dispatcher.dispatch({
      action:{type:Constants.ACTION_SET_COUNTRY_FOCUS},
      iso2:iso2
    })
  },

  showLegend(name) {
    dispatcher.dispatch({
      action:{type:Constants.ACTION_SET_LEGEND},
      name:name
    })
  },

};
