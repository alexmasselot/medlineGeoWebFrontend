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

@withStyles(styles) class CountryPairsChordPerYear extends Component {
  constructor() {
    super();

    this.state={};
    this._matrix=[];
    this._labels=[];
  }

  _onChange() {
    var _this = this;

    var countrySorted = CountryPairCountStore.getCountrySorted();
    var year = CountryPairCountStore.getData().year;
    _this._matrix.length == 0;
    let n = countrySorted.length;
    console.log(countrySorted);
    _.times(n, function(){
      var a = [];
      _.times(n, function(){a.push(0);});
      _this._matrix.push(a);
    });
    _this._labels=_.pluck(countrySorted, 'countryIso');

    var countryRow = {};
    _.each(countrySorted, function(c, i){
      countryRow[c.countryIso]=i;
    });
    _.chain(countrySorted)
      .pluck('countPairs')
      .flatten()
      .filter(function(p){
        return p.nbPubmedIds >=4;
      })
      .each(function(p){
        _this._matrix[countryRow[p.countryFrom]][countryRow[p.countryTo]]=p.nbPubmedIds;
      })
      .value();


    _this.data = {
                   year:year,
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

    _this._dim={
      height : parseInt(_this.props.height),
      width : parseInt(_this.props.width)
    };
    _this._dim.radius  = Math.min(_this._dim.width, _this._dim.height)*0.4;

    d3.select(el).selectAll().empty();
    var svg = d3.select(el).append('svg').attr({
      width: _this._dim.width,
      height: _this._dim.height,
      class: 'country-pairs-count-per-year'
    });

    _this._gMain = svg.append('g')
      .attr({
        transform:'translate('+(_this._dim.width/2)+', '+(_this._dim.height/2)+')'
      });

    console.log('THIS setup', _this);
    _this._svg = svg;
  }

  renderD3(el) {
    var _this = this;
    console.log('THIS render', _this);

    var width = 960,
    height = 500,
    innerRadius = _this._dim.radius,
    outerRadius = innerRadius * 1.1;

    var fill = d3.scale.ordinal()
    .domain(d3.range(4))
    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(_this._matrix);

    var gArcs =
    _this._gMain.append("g").selectAll("path")
        .data(chord.groups)
      .enter();

      gArcs.append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .attr('class', function(d){return _this._labels[d.index]})
        .on("mouseover", function(d){
          console.log(d);
        })
        //.on("mouseout", fade(1));

    _this._gMain.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1)
        .on("mouseover", function(d){
          console.log(d);
        })
;

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

export default CountryPairsChordPerYear;
