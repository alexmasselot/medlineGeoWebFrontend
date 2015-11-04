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
      load count data for a given radius + year, update the model and fire change event
    */
    getCount(radius, year){
      if(this.countListener()===0){
        return;
      }
      return httpClient.get('http://localhost:9000/citation-located/countByHexagon/' + radius + '?year=' + year)
      .then(function (data) {
                  _data.radius = radius;
                  _data.year = year;
                  _data.hexaCounts = data;
                  store.emitChange();
                });
    },

    dispatcherIndex: dispatcher.register(function (payload) {
      let _this = this;
      let action = payload.action;

      switch (action.type) {
        case Constants.ACTION_CITATION_LOCATED_COUNT_BY_HEXAGON:
          store.getCount(parseInt(payload.radius), parseInt(payload.year))
          break;

        case Constants.ACTION_YEAR_SELECTED:
          store.getCount(_data.radius, parseInt(payload.year))
          break;

        // add more cases for other actionTypes...
      }
    })

  })
  ;


export default store;

