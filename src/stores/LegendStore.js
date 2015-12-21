import React from 'react';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import httpClient from '../core/HttpClient';
import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';
import BaseStore from './BaseStore'
import _ from 'lodash';


let _legendDict = {};
let _focusLegendElement=undefined;

const store = assign({}, BaseStore, {

    registerLegend(name, html){
      _legendDict[name] = html;
    },

    setLegendFocus(name){
      _focusLegendElement = _legendDict[name];
      store.emitChange();
    },
    getLegendFocus(){
      return _focusLegendElement;
    },

    dispatcherIndex: dispatcher.register(function (payload) {
      let _this = this;
      let action = payload.action;

      switch (action.type) {
        case Constants.ACTION_SET_LEGEND:
          store.setLegendFocus(payload.name);
          break;
      }
    })
  });

export default store;

