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
      //console.log('countPairs', _data.countPairs);

      /*
      sort the data for the collaboration that represent the most important part of the destination country.
      */
      let lCounts = [].concat(_data.countPairs);
      lCounts = lCounts.concat(_.map(lCounts, function(cp){
                                     var cp2 = _.clone(cp);
                                     cp2.countryTo = cp.countryFrom;
                                     cp2.countryFrom = cp.countryTo;
                                     cp2.nbPubmedIdTotalFrom = cp.nbPubmedIdTotalTo;
                                     cp2.nbPubmedIdTotalTo = cp.nbPubmedIdTotalFrom;
                                     return cp2;
                                 }));

      lCounts = _.sortBy(lCounts, function(cp){
        return - cp.nbPubmedIds/cp.nbPubmedIdTotalFrom;
      });
      //distCountries ends up, for each country connected, to a sorted list by distance (1/the shared relative number of publications)
      var distCountries = {};
      _.chain(lCounts)
        .each(function(c){
          var d = (Math.min(c.nbPubmedIdTotalFrom, c.nbPubmedIdTotalTo))/c.nbPubmedIds;
          if(distCountries[c.countryFrom]===undefined){
            distCountries[c.countryFrom]= {};
          }
          if(distCountries[c.countryTo]===undefined){
            distCountries[c.countryTo]= {};
          }
          distCountries[c.countryFrom][c.countryTo]=d;
          distCountries[c.countryTo][c.countryFrom]=d;
        })
        .value();
      _.each(_.keys(distCountries), function(x){
          var a = [];
          _.each(distCountries[x], function(d, y){
              a.push({iso:y, dist:d});
            });
          distCountries[x] = _.sortBy(a, 'dist');
      });


      var getClosest = function(isos, aNotIn){
        let notIn = {};
        _.each(aNotIn, function(x){notIn[x]=true});

        var ret = _.map(isos, function(iso){
          return _.chain(distCountries[iso], function(e){
            return notIn[e.iso] === undefined;
          })
          .map('iso');
          .value();
        });
        //we have none connect to any isos, so let's pick the one with the shortest distance to someone else;
        if(ret === undefined){
          var a=[]
           _.each(distCountries, function(e, iso){
              if(notIn[iso] === undefined){
                a.push({iso:iso, dist:e[0].dist});
              }
          });
          if(a.length>0){
            ret=_.sortBy('dist')[0].iso;
          }
        }
        return ret;
      }

//      console.log('lCounts', lCounts.length);
      lCounts = lCounts;
      var i = 0;
      var removeCountryFrom = function(l, iso){
        return _.filter(l, function(cp){
           return cp.countryFrom !== iso;
         })
      };
      var fHandler = function(acc, hCounts){

//        console.log('----------- fHandler');
//        console.log('acc', acc);

        if(hCounts.length === 0){
//          console.log('empty hcount')
          return acc;
        }
//        console.log('hCounts');
//        _.chain(hCounts)
//         .take(20)
//         .each(function(c){
//          console.log('---', c.countryFrom, c.countryTo, c.nbPubmedIds, c.nbPubmedIds/c.nbPubmedIdTotalFrom, c.nbPubmedIds/c.nbPubmedIdTotalTo)
//         })
//         .value();

        if(acc.length === 0){
          let initCountry = hCounts[0].countryTo;
          acc.push(initCountry);

          return fHandler(acc, removeCountryFrom(hCounts, initCountry));
        }
        let leftCountry = acc[0];
        let leftMostCount = _.find(hCounts, function(cp){return cp.countryTo === leftCountry});
        let rightCountry = acc[acc.length-1];
        let rightMostCount = _.find(hCounts, function(cp){return cp.countryTo === rightCountry});
        let anchorCountry;

//        console.log('<- ->', leftCountry, rightCountry, hCounts.length)
//        console.log('counts', leftMostCount, rightMostCount);
//        console.log(leftMostCount === undefined, rightMostCount === undefined)

        //no on points to left or right, we can have some disconnected guys
        if((leftMostCount === undefined) && (rightMostCount === undefined)){
//          console.log('disconnected')
          acc.push(hCounts[0].countryTo);
          return fHandler(acc, removeCountryFrom(hCounts, hCounts[0].countryTo));
        }

        var closest;
        var insertLeft =  (rightMostCount === undefined) ||
                          ((leftMostCount !== undefined) && (leftMostCount.nbPubmedIds/leftMostCount.nbPubmedIdTotalFrom > rightMostCount.nbPubmedIds/rightMostCount.nbPubmedIdTotalFrom));
        if(insertLeft){
           closest = leftMostCount.countryFrom;
           anchorCountry = leftCountry;
           acc.unshift(closest);
        }else{
          closest = rightMostCount.countryFrom;
          anchorCountry = rightCountry;
          acc.push(closest);
        }
        //console.log('closest', closest)
        //console.log(acc)
        i++;
        if(i>=100){
          return acc
        }

//        console.log('removing from', closest, hCounts.length)
//        console.log(hCounts.length);
        return fHandler(acc, removeCountryFrom(hCounts, closest));
      };

      let ret =  _.map(fHandler([], lCounts), function(iso){
        return {
          countryIso:iso,
          countPairsTot: _.chain(lCounts).map(function(cp){return (cp.countryFrom === iso)?cp.nbPubmedIds:0;}).sum().value(),
          countPairs: _.filter(lCounts, function(cp){ return cp.countryFrom === iso}),
          countTot: _.find(lCounts, function(cp){return cp.countryFrom === iso}).nbPubmedIdTotalFrom
        }
      });
//      console.log('ret', ret)
      return ret;
    },

    /**
      count per country/year
    */
    getCount(year){
       var _this = this;
      if(this.countListener()===0){
        return;
      }
      //console.log('Damn year', year)
      return httpClient.get('http://localhost:9000/country-pair/count/' + year)
      .then(function (data) {
                  _data.year = year;
                  //console.log(data)
                  _this.setCountPairs(data)
                  store.emitChange();
                });
    },

    dispatcherIndex: dispatcher.register(function (payload) {
      let _this = this;
      let action = payload.action;

      switch (action.type) {
        case Constants.ACTION_CITATION_LOCATED_COUNT_BY_COUNTRY_PAIRS:
          store.getCount(parseInt(payload.year))
          break;

        case Constants.ACTION_YEAR_SELECTED:
          store.getCount(parseInt(payload.year))
          break;
      }
    })
  });

export default store;

