/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import styles from './HexaMap.css';
import withStyles from '../../decorators/withStyles';
import ActionCreators from '../../actions/ActionCreators';
import hexaCountStore from '../../stores/HexaCountStore';
import countryDefsStore from '../../stores/CountryDefsStore';
import topojson from 'topojson';
import _ from 'lodash';
import legendStore from '../../stores/LegendStore';

import d3 from 'd3';

let topojsonWorld =countryDefsStore.getTopoJson();


var update = function (props) {
  return function (me) {
    me.append('h1').text('TADAAAA')
  };
};

legendStore.registerLegend('HexaMap',
  <div>The graph displays publication count per location, grouped per hexagon:
    <ul className="legend">
      <li>the yellow to red color scale shows the relative number of publication per location.</li>
    </ul>
  </div>
)

@withStyles(styles) class HexaMap extends Component {
  constructor() {
    super();

    this._data = {};
  }

  _onChange() {
    var _this = this;
    _this._data = hexaCountStore.getData();
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
    hexaCountStore.addChangeListener(function () {
      _this._onChange();
    });
    this.setupD3(ReactDOM.findDOMNode(this));

    //d3.select(ReactDOM.findDOMNode(this))
    //  .call(update(this.props));
  }

  componentWillUnmount() {
    hexaCountStore.removeChangeListener(function () {
      _this._onChange();
    });
  }

  setupD3(el) {
    var _this = this;

    d3.select(el).selectAll().empty();
    var svg = d3.select(el).append('svg').attr({
      width: this.props.width,
      height: this.props.height,
      class: 'hexamap'
    });

    svg.on('mouseover',function(){
      ActionCreators.showLegend('HexaMap');
    });


    _this._gHexagons = svg.append('g').attr('class', 'hexagons');
    var gCountries = svg.append('g').attr('class', 'map-countries')
    //.attr({transform:'translate('+this.props.width / 2+','+this.props.height * 0.5+')'});

    _this._projection = d3.geo.equirectangular()
      .precision(.1);
    let xmax = _this._projection([179.9,0])[0];
    let ymax = _this._projection([0,-89.9])[1];
    let x0 = _this._projection([0,0])[0];
    let y0 = _this._projection([0,0])[1];
    let xFactor = _this.props.width/2/(xmax-x0)
    let yFactor = _this.props.height/2/(ymax-y0)
    let scale = Math.min(xFactor, yFactor)*140

    _this._projection =  _this._projection
      .translate([_this.props.width/2, _this.props.height/2])
      .scale(scale);

    _this._geoPath = d3.geo.path()
      .projection(_this._projection);

    var countries = topojsonWorld.features;
    gCountries.selectAll(".country")
      .data(countries)
      .enter().insert("path", ".graticule")
      .attr("class", "country")
      .attr("d", _this._geoPath);

  }

  renderD3(el) {
    var _this = this;
    var r = hexaCountStore.getData().radius;
    var rp = hexaCountStore.getData().radius * Math.sqrt(3) / 2;

    var maxCount = _.chain(hexaCountStore.getData().hexaCounts).pluck('countPubmedId').max().value();
    var features = _.chain(hexaCountStore.getData().hexaCounts)
      .filter(function (c) {
        return c.countPubmedId >= 5;
      })
      .map(function (c) {
        var cx = c.hexaCoordinates.lng;
        var cy = c.hexaCoordinates.lat;

        return {
          type: 'Polygon',
          coordinates: [[
            [cx, cy + r],
            [cx + rp, cy + r / 2],
            [cx + rp, cy - r / 2],
            [cx, cy - r],
            [cx - rp, cy - r / 2],
            [cx - rp, cy + r / 2],
            [cx, cy + r]
          ]],
          countPubmedId: c.countPubmedId
        };
      })
      .value();

    var color = d3.scale.log().domain([1, maxCount]).range(["#ffff44", "#ff0000"])
    _this._gHexagons.selectAll('path.count').remove();
    _this._gHexagons.selectAll('path.count')
      .data(features)
      .enter()
      .append('path')
      .attr({
        d: _this._geoPath,
        class: 'count'
      })
      .style('fill', function (f) {
        return color(f.countPubmedId);
      });
  }

  render() {
    var _this = this;

    var width = _this.props.width || 800;
    var height = _this.props.width || height;

    var elMain = <svg height={height} width={width}/>;
    var radius = _this._data ? _this._data.radius : '?';
    return <div className="HexaMap">
    </div>;
  }
}

export default HexaMap;
