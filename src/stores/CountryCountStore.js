import React from 'react';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import httpClient from '../core/HttpClient';
import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';
import BaseStore from './BaseStore'

var _data = {};

const store = assign({}, BaseStore, {

    getData() {
      return _data;
    },

    /**
      count per country/year
    */
    getCount(year){
      if(this.countListener()===0){
        return;
      }
      return httpClient.get('http://localhost:9000/country/count/' + year)
      .then(function (data) {
                  _data.year = year;
                  _data.countryCount = data;
                  store.emitChange();
                });
    },

    dispatcherIndex: dispatcher.register(function (payload) {
      let _this = this;
      let action = payload.action;

      switch (action.type) {
        case Constants.ACTION_CITATION_LOCATED_COUNT_BY_COUNTRY:
          store.getCount(parseInt(payload.year))
          break;

        case Constants.ACTION_YEAR_SELECTED:
          store.getCount(parseInt(payload.year))
          break;
      }
    })
  });

export default store;

