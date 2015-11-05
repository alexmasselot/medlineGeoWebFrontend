/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './HexaMapPage.css';
import withStyles from '../../decorators/withStyles';
import hexaCountStore from '../../stores/HexaCountStore';
import HexaMap from '../HexaMap/HexaMap';
import YearSlider from '../YearSlider/YearSlider';

@withStyles(styles)
class HexaMapPage extends Component {
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
    return (

      <div className="HexaMap">

        <YearSlider store={hexaCountStore} minYear={1960} maxYear={2014}/>
        <div className="HexaMap-container">
          <HexaMap height="700" width="960"/>
        </div>
      </div>
    );
  }

}

export default HexaMapPage;
