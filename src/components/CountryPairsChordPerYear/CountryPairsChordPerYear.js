/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */
'use strict';

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import styles from './CountryPairsChordPerYear.css';
import withStyles from '../../decorators/withStyles';
import CountryPairCountStore from '../../stores/CountryPairCountStore.js';
import _ from 'lodash';

import d3 from 'd3';


var update = function (props) {
  return function (me) {
    me.append('h1').text('TADAAAA')
  };
};

@withStyles(styles) class CountryCountPerYear extends Component {
  constructor() {
    super();

    this.state={};
    this._matrix=[];
  }

  _onChange() {
    var _this = this;

    var countrySorted = CountryPairCountStore.getCountrySorted();
    _this._matrix.length == 0;
    let n = countrySorted.length;
    console.log(countrySorted);
    _.times(n, function(){
      var a = [];
      _.times(n, function(){a.push(0);});
      _this._matrix.push(a);
    });

    var countryRow = {};
    _.each(countrySorted, function(c, i){
      countryRow[c.countryIso]=i;
    });
    _.chain(countrySorted)
      .pluck('countPairs')
      .flatten()
      .each(function(p){
        _this._matrix[countryRow[p.countryFrom]][countryRow[p.countryTo]]=p.nbPubmedIds;
      })
      .value();

    console.log(_this._matrix);

    _this.data = {
                   year:data.year,
                   };

    _this.setState({});
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(props) {
    this.renderD3(ReactDOM.findDOMNode(this));

    // always skip React's render step
    return false;
  }

  componentDidMount() {
    var _this = this;
    CountryPairCountStore.addChangeListener(function () {
      _this._onChange();
    });
    _this.setupD3(ReactDOM.findDOMNode(this));

  }

  componentWillUnmount() {
    CountryPairCountStore.removeChangeListener(function () {
      _this._onChange();
    });
  }

  setupD3(el) {
    var _this = this;

    d3.select(el).selectAll().empty();
    var svg = d3.select(el).append('svg').attr({
      width: this.props.width,
      height: this.props.height,
      class: 'country-pairs-count-per-year'
    });


  }

  renderD3(el) {
    var _this = this;


  }

  render() {
    var _this = this;

    var width = _this.props.width || 800;
    var height = _this.props.width || height;



    var elMain = <svg height={height} width={width}/>;
    return <div className="country-count-per-year">
    </div>;
  }
}

export default CountryCountPerYear;
