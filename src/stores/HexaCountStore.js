import React from 'react';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import httpCLient from '../core/HttpClient';
import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';
import BaseStore from './BaseStore'

var _data = {};

const store = assign({}, BaseStore, {

  getAll() {
    console.log('getting all', _data);
    return _data;
  },
  dispatcherIndex: dispatcher.register(function (payload) {
    let action = payload.action;

    console.log('HAHAHAH ', payload, store)
    switch (action.type) {
      case Constants.ACTION_CITATION_LOCATED_COUNT_BY_HEXAGON:
        console.log('PAF in the hexagon');
        let radius = parseInt(payload.radius);
        let year = parseInt(payload.year);

        _data.radius = radius;
        _data.year = year;
        store.emitChange();
        break;

      // add more cases for other actionTypes...
    }
  })

})
  ;




export default store;

