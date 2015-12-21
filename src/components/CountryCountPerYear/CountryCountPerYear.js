/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import styles from './CountryCountPerYear.css';
import withStyles from '../../decorators/withStyles';
import countryCountStore from '../../stores/CountryCountStore.js';
import _ from 'lodash';
import ActionCreators from '../../actions/ActionCreators';
import legendStore from '../../stores/LegendStore';


import d3 from 'd3';


var update = function (props) {
  return function (me) {
  };
};

legendStore.registerLegend('CountryCountPerYear',
  <div>The graph displays publication count for the top most countries:
    <ul className="legend">
      <li>mouse over a flag for country name</li>
    </ul>
  </div>
)

@withStyles(styles) class CountryCountPerYear extends Component {
  constructor() {
    super();

    this.state={};
    this.count_data=[];
    this.labeled_data=[];
    this._maxCountry=30;
  }

  _onChange() {
    var _this = this;
    var data = countryCountStore.getData()
    var minCount = _.chain(data.countryCount)
    .pluck('countPubmedId')
    .sortBy(function(c){
      return -c;
    })
    .take(_this._maxCountry)
    .last()
    .value();
    var countryCount = _.chain(data.countryCount)
      .sortBy(function(c){
        return -c.countPubmedId;
      })
      .takeWhile(function(c){
        return c.countPubmedId>=minCount;
      })
      .value()

    let h = {};
    _.each(countryCount, function(c){
      h[c.countryIso]=c;
    });

    var prevCountData = _.clone(_this.count_data);

    _this.count_data.length=0;

    _.each(prevCountData, function(c, i){
      if(h[c.countryIso]){
        c.countPubmedId = h[c.countryIso].countPubmedId;
        _this.count_data.push(h[c.countryIso]);
        delete h[c.countryIso];
      }
    })
    _.each(_.values(h), function(c){
      _this.count_data.push(c);
    });

    _this.labeled_data.length=0;
    _.chain(_this.count_data)
      .sortBy(function(c){
        return -c.countPubmedId;
      })
      .take(3)
      .each(function(c){
        _this.labeled_data.push(c);
      })
      .value();

    _this.data = {
                   year:data.year,
                   maxCount:countryCount[0]?countryCount[0].countPubmedId:1
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
    countryCountStore.addChangeListener(function () {
      _this._onChange();
    });
    _this.setupD3(ReactDOM.findDOMNode(this));

  }

  componentWillUnmount() {
    countryCountStore.removeChangeListener(function () {
      _this._onChange();
    });
  }

  setupD3(el) {
    var _this = this;

    d3.select(el).selectAll().empty();
    var svg = d3.select(el).append('svg').attr({
      width: this.props.width,
      height: this.props.height,
      class: 'country-count-per-year'
    });

    svg.on('mouseover',function(){
      ActionCreators.showLegend('CountryCountPerYear');
    });

    let marginHoriz=5;
    let marginVert=70;
    var h=_this.props.height-marginVert;
    var w = _this.props.width-marginHoriz-10;
   _this._gAxes={};
   _this._gAxes.x=svg.append('g')
    .attr({
      class:'axis x',
      transform:'translate('+marginHoriz+', '+h+')'
    });

    _this._scales={
      x:d3.scale.ordinal().rangeRoundBands([0, w], 0.1),
      y:d3.scale.linear().range([h, 0])
    }

    _this._gData = svg.append('g').attr({
      class:'data',
      transform:'translate('+marginHoriz+', 0)'
    });
    _this._gLabel = _this._gData.append('g').attr('class', 'label');
  }

  renderD3(el) {
    var _this = this;
    _this._scales.y.domain([0, _this.data.maxCount*1.08]);

    _this._scales.x.domain(_.chain(_this.count_data).sortBy(function(c){
      return -c.countPubmedId;
    }).pluck('countryIso').value());

    var xAxis = d3.svg.axis().scale(_this._scales.x).orient('bottom');
    //_this._gAxes.x.call(xAxis);


    let y0 = _this._scales.y(0);
    let bars = _this._gData.selectAll('rect.country-count').data(_this.count_data);
    let flags=_this._gData.selectAll('image.flag').data(_this.count_data);
    let labels = _this._gData.selectAll('text.country-count-label').data(_this.labeled_data);

     bars.exit().transition()
      .duration(300)
      .attr("y", y0)
      .attr("height", 0)
      .style('fill-opacity', 1e-6)
      .remove();

    bars.enter()
      .append('rect')
      .attr({
        class:'country-count'
      });

    bars.transition().duration(300)
      .attr({
        x:function(c){
          return _this._scales.x(c.countryIso);
        },
        y:function(c){
          return _this._scales.y(c.countPubmedId);
        },
        height:function(c){
         return y0-_this._scales.y(c.countPubmedId);
        },
         width:_this._scales.x.rangeBand()

      });

   labels.exit().transition()
      .duration(300)
      .style('fill-opacity', 1e-6)
      .remove();

    labels.enter()
      .append('text')
      .attr({
        class:'country-count-label'
  });

    labels.transition().duration(300)
      .attr({
        x:function(c){
          return _this._scales.x(c.countryIso) + _this._scales.x.rangeBand()/2;
        },
        y:function(c){
          return _this._scales.y(c.countPubmedId)-2;
        }
      })
      .text(function(c){
        let n = c.countPubmedId;
        if(n<1000){
          return n;
        }
        if(n<100000){
          return ''+(Math.round(n/100)/10)+'k';
        }
        return ''+Math.round(n/1000)+'k';
      });

    flags.enter()
      .append('image')
      .attr({
        class:'flag',
        'xlink:href':function(c){
          return 'images/flags_iso/48/'+c.countryIso.toLowerCase()+'.png'
        },
        y:y0,
       })
       .on('mouseover', function(c){
        ActionCreators.showCountryDetails(c.countryIso);
       });

    flags
      .attr({
        'xlink:href':function(c){
          return 'images/flags_iso/48/'+c.countryIso.toLowerCase()+'.png'
        },
      })
      .transition()
      .duration(300)
      .attr({
        x:function(c){
          return _this._scales.x(c.countryIso);
        },
        width:_this._scales.x.rangeBand(),
        height:_this._scales.x.rangeBand()
      });
    flags.exit()
      .transition()
      .duration(300)
      .style('fill-opacity', 1e-6)
      .remove();

  }

  render() {
    var _this = this;

    var width = _this.props.width || 666;
    var height = _this.props.width || 333;

    var elMain = <svg height={height} width={width}/>;
    return <div className="country-count-per-year">
    </div>;
  }
}

export default CountryCountPerYear;
