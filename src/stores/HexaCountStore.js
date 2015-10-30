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
    dispatcherIndex: dispatcher.register(function (payload) {
      let action = payload.action;

      switch (action.type) {
        case Constants.ACTION_CITATION_LOCATED_COUNT_BY_HEXAGON:
          let radius = parseInt(payload.radius);
          let year = parseInt(payload.year);

          httpClient.get('http://localhost:9000/citation-located/countByHexagon/' + radius + '?year=' + year).then(function (data) {
            _data.radius = radius;
            _data.year = year;
            _data.hexaCounts = data;
            store.emitChange();
          });
          break;

        // add more cases for other actionTypes...
      }
    })

  })
  ;


export default store;

