'use strict';
jest.dontMock('lodash');
jest.dontMock('object-assign');
jest.dontMock('../CountryPairCountStore');
jest.dontMock('./country-pair-count.json');


describe('CountryPairCountStore', function() {
  var _ = require('lodash');

  var CountryPairCountStore;
  var mockData;
  beforeEach(function() {
    CountryPairCountStore=require('../CountryPairCountStore');
    mockData=require('./country-pair-count.json');
  });
 it('store is defined', function() {
   expect(CountryPairCountStore).not.toBeUndefined();
 });

 it('lCounts', function(){
    expect(mockData).not.toBeUndefined();
    expect(mockData.length).toBe(7);
    CountryPairCountStore.setCountPairs(mockData);

    expect(CountryPairCountStore.getData().countPairs).not.toBeUndefined();
    expect(CountryPairCountStore.getData().countPairs.length).toBe(7);
 });

 describe('getCountrySorted', function(){
  var countrySorted;
  var gb;
  beforeEach(function(){
    CountryPairCountStore.setCountPairs(mockData);
    countrySorted = CountryPairCountStore.getCountrySorted();
    gb = _.find(countrySorted, function(cp){
      return cp.countryIso === 'GB';
    })
  });
  it('countryIso', function(){
    expect (_.pluck(countrySorted, 'countryIso')).toEqual(['JP', 'CN', 'US', 'GB', 'XY', 'XZ'])
  });
  it('countPairsTot', function(){
    expect(gb.countPairsTot).toBe(425);
  })
  it('countPairs', function(){
    expect(gb.countPairs.length).toBe(3);
  })
  it('countTot', function(){
    expect(gb.countTot).toBe(26865);
  })
 });
});
