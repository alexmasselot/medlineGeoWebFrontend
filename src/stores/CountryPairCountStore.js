'use strict';

import React from 'react';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import httpClient from '../core/HttpClient';
import dispatcher from '../core/Dispatcher';
import Constants from '../constants/Constants';
import BaseStore from './BaseStore'
import _ from 'lodash';

var _data = {};

/**
 CountryPairCountStore handles the pair of collaboration to/from
 It is able to expose the adjacency list of contries, based on the number of publication they share together.
*/
const store = assign({}, BaseStore, {

    /**
      set the input counts (as they should come from the REST service)
    */
    setCountPairs(lCounts){
      _data.countPairs = lCounts;
      return this;
    },

    getData() {
      return _data;
    },

    /**
      assort the countries by some kind of proximity order
      we start by the most popular guy, then add on left or right of the array, the next most popular.
      This is certainly a pretty dummy method...

    */
    getCountrySorted(){
      var _this = this;

      if(_.size(_data.countPairs)===0){
        return [];
      }

      var countryTot = {};
      _.each(_data.countPairs, function(cp){
        countryTot[cp.countryFrom] = cp.nbPubmedIdTotalFrom;
        countryTot[cp.countryTo] = cp.nbPubmedIdTotalTo;
      })

      /*
      sort the data for the colloboration that represent the most important part of the destination country.
      */
      var lCounts = _.sortBy(_data.countPairs, function(cp){
        return - cp.nbPubmedIds/cp.nbPubmedIdTotalTo;
      });
      lCounts = lCounts.concat(_.map(lCounts, function(cp){
          var cp2 = _.clone(cp);
          cp2.countryTo = cp.countryFrom;
          cp2.countryFrom = cp.countryTo;
          cp2.nbPubmedIdTotalFrom = cp.nbPubmedIdTotalTo;
          cp2.nbPubmedIdTotalTo = cp.nbPubmedIdTotalFrom;
          return cp2;
      }));
      var fHandler = function(acc, hCounts){
        //console.log('----------- fHandler');
        //console.log('acc', acc);

        if(hCounts.length === 0){
          return acc;
        }
        //console.log('hCounts', hCounts);

        if(acc.length === 0){
          let initCountry = hCounts[0].countryFrom;
          acc.push(initCountry);

          return fHandler(acc, _.filter(hCounts, function(cp){
                                         return cp.countryTo !== initCountry;
                                       }));
        }
        let leftCountry = acc[0];
        let leftMostCount = _.find(hCounts, function(cp){return cp.countryFrom === leftCountry});
        let rightCountry = acc[acc.length-1];
        let rightMostCount = _.find(hCounts, function(cp){return cp.countryFrom === rightCountry});

        var closest;
        if(leftMostCount.nbPubmedIds/leftMostCount.nbPubmedIdTotalTo > rightMostCount.nbPubmedIds/rightMostCount.nbPubmedIdTotalTo){
           closest = leftMostCount.countryTo;
           acc.unshift(closest);
        }else{
          closest = rightMostCount.countryTo;
          acc.push(closest);
        }
        return fHandler(acc, _.filter(hCounts, function(cp){
          return cp.countryTo !== closest;
        }))
      };

      let ret =  _.map(fHandler([], lCounts), function(iso){
        return {
          countryIso:iso,
          countTot: _.chain(lCounts).map(function(cp){return (cp.countryFrom === iso)?cp.nbPubmedIdTotalFrom:0;}).sum().value(),
          counts: _.filter(lCounts, function(cp){ return cp.countryFrom === iso})
        }
      });
      return ret;
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

