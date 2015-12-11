import React from 'react';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import httpClient from '../core/HttpClient';
import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';
import BaseStore from './BaseStore'
import _ from 'lodash';

import topojsonWorld from './data/world-110m.json';


let _data = {};

const store = assign({}, BaseStore, {

    getTopoJson() {
      return topojsonWorld;
    },

    getInfoByIso2(iso2){
      let _this = this;

      //builds the dictionary if not ready
      if(_this._hInfos === undefined){
         _this._hInfos= {};
        _.each(topojsonWorld.features, function(ft){
          _this._hInfos[ft.properties.iso_a2] = ft.properties;
        });
      }

      return _this._hInfos[iso2];
    },

    setCountryFocus(iso2){
      _data.countryFocus = this.getInfoByIso2(iso2);
      store.emitChange();
    },

    getCountryFocus(){
      return _data.countryFocus
    },

    dispatcherIndex: dispatcher.register(function (payload) {
      let _this = this;
      let action = payload.action;

      switch (action.type) {
        case Constants.ACTION_SET_COUNTRY_FOCUS:
          store.setCountryFocus(payload.iso2.toUpperCase());
          break;
      }
    })
  });

export default store;

