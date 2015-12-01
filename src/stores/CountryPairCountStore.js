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
        //console.log('notIn', notIn)
        var ret = _.chain(isos)
          .map(function(iso){
            return _.chain(distCountries[iso])
             .filter(function(e){
              return notIn[e.iso] === undefined;
            })
            .map(function(e){
              let r=_.clone(e);
              e.anchor=iso;
              return e;
            })
            .first()
            .value();
          })
         .sortBy('dist')
         .first()
         .value();
         //console.log('ret first', ret);
        //we have none connect to any isos, so let's pick the one with the shortest distance to someone else;
        if(ret === undefined){
          var a=[]
           _.each(distCountries, function(e, iso){
              if(notIn[iso] === undefined){
                a.push({iso:iso, dist:e[0].dist});
              }
          });
          if(a.length>0){
            ret=_.sortBy(a, 'dist')[0];
          }
        }
        return ret;
      }

//      console.log('lCounts', lCounts.length);
      lCounts = lCounts;
      var i = 0;
      var fHandler = function(acc){

//        console.log('----------- fHandler');
//        console.log('acc', acc);

        if(acc.length === 0){
          acc.push(getClosest([], []).iso);
          return fHandler(acc);
        }

        let closest = getClosest([acc[0], acc[acc.length-1]], acc);
        //console.log('closest', closest)

        if(closest === undefined){
          return acc;
        }

        //no on points to left or right, we can have some disconnected guys
        if(acc[0] === closest.anchor){
           acc.unshift(closest.iso);
        }else{
          acc.push(closest.iso);
        }
        //console.log('closest', closest)
        //console.log(acc)
        i++;
        if(i>=100){
          return acc
        }

//        console.log('removing from', closest, hCounts.length)
//        console.log(hCounts.length);
        return fHandler(acc);
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

