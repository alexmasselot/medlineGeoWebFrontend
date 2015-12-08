/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './CountryPairsPage.css';
import withStyles from '../../decorators/withStyles';
import countryPairCountStore from '../../stores/CountryPairCountStore';
import CountryPairsForcePerYear from '../CountryPairsForcePerYear/CountryPairsForcePerYear';
import YearSlider from '../YearSlider/YearSlider';

@withStyles(styles)
class CountryPairsPage extends Component {
  constructor(){
    super();
  }

  _onChange() {
    var _this = this;
  }

  componentDidMount() {
    var _this = this;
    countryPairCountStore.addChangeListener(function(){
      _this._onChange();
    });
  }

  componentWillUnmount() {
    countryPairCountStore.removeChangeListener(this._onChange);
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    var _this= this;
    var radius = _this._data?_this._data.radius:0;
    const title = 'country count';

    this.context.onSetTitle(title);
    return (
      <div className="country-count graph-layout">
        <YearSlider store={countryPairCountStore} minYear={1960} maxYear={2014}/>
        <div className="country-count-container">
          <CountryPairsForcePerYear height="500" width="960"/>
        </div>
      </div>
    );
  }

}

export default CountryPairsPage;
