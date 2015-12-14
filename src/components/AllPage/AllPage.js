/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './AllPAge.css';
import withStyles from '../../decorators/withStyles';
import hexaCountStore from '../../stores/HexaCountStore';
import countryCountStore from '../../stores/CountryCountStore.js';
import countryPairCountStore from '../../stores/CountryPairCountStore.js';
import HexaMap from '../HexaMap/HexaMap';
import CountryCountPerYear from '../CountryCountPerYear/CountryCountPerYear';
import CountryPairsForcePerYear from '../CountryPairsForcePerYear/CountryPairsForcePerYear';
import YearSlider from '../YearSlider/YearSlider';
import Dimensions from 'react-dimensions';

@withStyles(styles)
class AllPAge extends Component {
  constructor(){
    super();
  }

  _onChange() {
    var _this = this;
  }

  componentDidMount() {
    var _this = this;
    hexaCountStore.addChangeListener(function(){
      _this._onChange();
    });
  }

  componentWillUnmount() {
    hexaCountStore.removeChangeListener(this._onChange);
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    var _this= this;
    var radius = _this._data?_this._data.radius:0;
    const title = 'mapped publication count';

    this.context.onSetTitle(title);

    let w = _this.props.containerWidth/2-20;
    let h = (_this.props.containerHeight-28)/2;
    return (
      <div className="All-container graph-layout">

        <YearSlider store={[hexaCountStore,countryCountStore,countryPairCountStore]} minYear={1960} maxYear={2014}/>
        <div className="HexaMap-container" style={{height:h, width:w, float:'left'}}>
          <div className="enlarge"><a href="/hexamap">[enlarge]</a></div>
          <HexaMap height={h} width={w}/>
        </div>
        <div className="country-count-container" style={{height:h, width:w, float:'left'}}>
          <div className="enlarge"><a href="/country">[enlarge]</a></div>
          <CountryCountPerYear  height={h} width={w}/>
        </div>
        <div className="country-pairs-force-container"  style={{height:h, width:w, float:'left'}}>
          <div className="enlarge"><a href="/country-pairs">[enlarge]</a></div>
          <CountryPairsForcePerYear height={h} width={w}/>
        </div>

      </div>
    );
  }

}

export default Dimensions()(AllPAge);
