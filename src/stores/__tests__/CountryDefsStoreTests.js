'use strict';
jest.dontMock('lodash');
jest.dontMock('object-assign');
jest.dontMock('../CountryDefsStore');
jest.dontMock('../data/world-110m.json');


describe('CountryPairCountStore', function() {
  var _ = require('lodash');

  var countryDefsStore;
  beforeEach(function() {
    countryDefsStore=require('../CountryDefsStore');
  });
 it('store is defined', function() {
   expect(countryDefsStore).not.toBeUndefined();
 });

 describe('getByIso2', function(){
  it('AF', function(){
    let country = countryDefsStore.getInfoByIso2('AF');
    expect(country.name).toBe('Afghanistan');
  });
 });


});
