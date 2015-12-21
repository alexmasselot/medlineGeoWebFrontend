/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */
'use strict';

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import styles from './CountryPairsForcePerYear.css';
import withStyles from '../../decorators/withStyles';
import ActionCreators from '../../actions/ActionCreators';
import CountryPairCountStore from '../../stores/CountryPairCountStore.js';
import legendStore from '../../stores/LegendStore';

import _ from 'lodash';

import d3 from 'd3';


var update = function (props) {
  return function (me) {
    me.append('h1').text('TADAAAA')
  };
};

legendStore.registerLegend('CountryPairsForcePerYear',
  <div>The graph displays links between countries per localized publications:
    <ul className="legend">
      <li>the flag size shows the relative number of publications per country;</li>
      <li>link width shows the overall collaboration contribution;</li>
      <li>mouse over a flag for country name</li>
      <li>click and drag a flag to fix it;</li>
      <li>double click to release it;</li>
      <li>wheel or drag to zoom in and out.</li>
    </ul>
  </div>
)


@withStyles(styles) class CountryPairsForcePerYear extends Component {
  constructor() {
    super();

    this._nodes = [];
    this._links = [];
    this._year=1905;
    this.state={
      };
  }

  _onChange() {
    var _this = this;

    var _data = CountryPairCountStore.getData();

    //takes the links with the number of shared publications of the 100th most tighted coutnires
    var nbThres = _.chain(_data.countPairs)
      .pluck('nbPubmedIds')
      .sortBy(function(n){
        return -n;
      })
      .take(100)
      .last()
      .value();

    var countPairs = _.filter(_data.countPairs, function(cp){
      return cp.nbPubmedIds >= nbThres  ;
    });

    var countCollabPerCountry ={}
    _.chain(countPairs)
      .map(function(cp){
        return [{
              iso:cp.countryFrom,
              nbPubmedIds:cp.nbPubmedIds
            }, {
              iso:cp.countryTo,
              nbPubmedIds:cp.nbPubmedIds
            }];
      })
      .flatten()
      .groupBy('iso')
      .map(function(l, iso){
        countCollabPerCountry[iso]=_.chain(l).pluck('nbPubmedIds').sum().value();
      })
      .value();

    let hNewCountries = {};

     _.chain(countPairs)
      .map(function(cp){
        return [{
              iso:cp.countryFrom,
              nbPubmedIds:cp.nbPubmedIdTotalFrom,
              totCollab:countCollabPerCountry[cp.countryFrom]
            }, {
              iso:cp.countryTo,
              nbPubmedIds:cp.nbPubmedIdTotalTo,
              totCollab:countCollabPerCountry[cp.countryTo]
            }];
      })
      .flatten()
      .uniq('iso')
      .each(function(c){
        hNewCountries[c.iso] = c;
      })
      .value();

    let tmpNodes = _.clone(_this._nodes);
    _this._nodes.length=0;
    _.each(tmpNodes, function(n){
        if(hNewCountries[n.iso] !== undefined){
            _.each(hNewCountries[n.iso], function(v, k){
              n[k]=v;
            });
          _this._nodes.push(n);
          delete hNewCountries[n.iso];
        }
    });
    _.each(hNewCountries, function(n){
      _this._nodes.push(n);
    });


    let _ref = {};
    _.each(this._nodes, function(c){
      _ref[c.iso] = c;
    });

    _this._links.length=0

     _.chain(countPairs)
                   .map(function(cp){
                      return {
                        source:_ref[cp.countryFrom],
                        target:_ref[cp.countryTo],
                        nbPubmedIds:cp.nbPubmedIds,
                        proximity:cp.nbPubmedIds/Math.min(countCollabPerCountry[cp.countryFrom], countCollabPerCountry[cp.countryFrom])
                      }
                   })
     .each(function(l){
       _this._links.push(l);
     })
     .value();

    _this._year = _data.year;
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
    _this._transform = {
      translate:[0,0],
      scale:1
    };
    _this._dim.radius  = Math.min(_this._dim.width, _this._dim.height)*0.4;

    d3.select(el).selectAll().empty();

		var zoomed = function() {
		  _this._transform.translate =  d3.event.translate;
		  _this._transform.scale =  d3.event.scale;

			_this._gMain.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		};

    var zoom = d3.behavior.zoom()
    		    .scaleExtent([0.1, 10])
    		    .on("zoom", zoomed);

    _this._svg = d3.select(el).append('svg').attr({
      width: _this._dim.width,
      height: _this._dim.height,
      class: 'country-pairs-force-per-year'
    })
    .call(zoom);

    _this._svg.on('mouseover',function(){
      ActionCreators.showLegend('CountryPairsForcePerYear');
    });

    let d0 = Math.min(_this._dim.width, _this._dim.height)/5;
    _this._force = d3.layout.force()
        .gravity(.1)
        .distance(function(cp){
          return 30+0.15*d0/cp.proximity;
        })
        .charge(-1000)
        .size([_this._dim.width, _this._dim.height]);
    _this._force.nodes(_this._nodes)
                .links(_this._links);

    _this._gMain = _this._svg.append('g');
    _this._gLinks = _this._gMain.append('g');
    _this._gNodes = _this._gMain.append('g');


    var dragStart = function(d) {
      d3.event.sourceEvent.stopPropagation();
      d.fixed = true;
      d3.select(this).classed("fixed",true);
    }
    _this._dragNode = _this._force.drag()
        .on("dragstart", dragStart);


    _this._force.on('end', function(){
      //_this._force.friction(0.02);
      let oldScale = _this._transform.scale;
      let xs = _.chain(_this._nodes).pluck('x');
      let xmin = xs.min().value();///oldScale-_this._transform.translate[0];
      let xmax = xs.max().value();///oldScale-_this._transform.translate[0];

      let ys = _.chain(_this._nodes).pluck('y');
      let ymin = ys.min().value();///oldScale-_this._transform.translate[1];
      let ymax = ys.max().value();///oldScale-_this._transform.translate[1];

      _this._transform.scale = Math.min(_this._dim.width/(xmax-xmin),  _this._dim.height/(ymax-ymin),2)*0.95;
      _this._transform.translate[0] = _this._dim.width/2 -(xmax+xmin)/2*_this._transform.scale ;
      _this._transform.translate[1] = _this._dim.height/2 -(ymax+ymin)/2*_this._transform.scale ;

      zoom.translate(_this._transform.translate);
      zoom.scale(_this._transform.scale);
      _this._gMain
            .transition()
            .duration(300)
            .attr("transform", "translate(" + _this._transform.translate[0]+','+ _this._transform.translate[1]+ ")scale(" + _this._transform.scale + ")")
    });

  }

  renderD3(el) {
    var _this = this;
    if(_this._nodes.length === 0){
      return;
    }

     var link = _this._gLinks.selectAll("path.link").data(_this._links);
     var node = _this._gNodes.selectAll("g.node").data(_this._nodes);

     link.enter().append("path")
       .attr("class", "link")
       .style({
        'opacity': function(cp){return 0.6;}
       });


    var dblclick = function(d) {
			d3.select(this).classed("fixed", d.fixed = false);
		}

    var fw = function(c){
      return 3+6*Math.log10(c.nbPubmedIds);
     };

     node.enter().append("g")
           .attr({
            class:'node'
           })
        .on('mouseover', function(c){
            ActionCreators.showCountryDetails(c.iso);
        })
        .on("dblclick", dblclick)
        .call(_this._dragNode);


      node.selectAll('image').remove();

      node.append('image').attr({
          'xlink:href':function(c){
            return 'images/flags_iso/48/'+c.iso.toLowerCase()+'.png';
            }
          }).attr({
          x:function(c){
            return -fw(c)/2;
          },
          y:function(c){
            return -fw(c)/2;
          },
          width:fw,
          height:fw
        });

     link.exit().remove();
     node.exit().remove();
     _this._force.start();

  _this._force.on("tick", function() {
    link.attr(
        'd', function(d){
          let x1=d.source.x;
          let x2=d.target.x;
          let y1=d.source.y;
          let y2=d.target.y;

          let dx = x2-x1;
          let dy = y2-y1;
          let dn = Math.sqrt(dx*dx+dy*dy);
          dx = dx/dn;
          dy = dy/dn;

          let wSource = 5*d.nbPubmedIds/d.source.totCollab;
          let wTarget = 5*d.nbPubmedIds/d.target.totCollab;
          return 'M'+(x1-dy*wSource)+', '+(y1+dx*wSource) +
                 'L'+(x1+dy*wSource)+', '+(y1-dx*wSource) +
                 'L'+(x2+dy*wTarget)+', '+(y2-dx*wTarget) +
                 'L'+(x2-dy*wTarget)+', '+(y2+dx*wTarget) +
                 'Z';
        }
    );

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

//  _this._force.on('end', function(){
//    _this._force.friction(0.1);
//  })

  }

  render() {
    var _this = this;

    var width = _this.props.width || 800;
    var height = _this.props.width || height;

    return <div className="country-count-per-year">
    </div>;
  }
}

export default CountryPairsForcePerYear;
