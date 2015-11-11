/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './CountryPage.css';
import withStyles from '../../decorators/withStyles';
import countryCountStore from '../../stores/CountryCountStore';
import CountryCountPerYear from '../CountryCountPerYear/CountryCountPerYear';
import YearSlider from '../YearSlider/YearSlider';

@withStyles(styles)
class CountryPage extends Component {
  constructor(){
    super();
  }

  _onChange() {
    var _this = this;
  }

  componentDidMount() {
    var _this = this;
    countryCountStore.addChangeListener(function(){
      _this._onChange();
    });
  }

  componentWillUnmount() {
    countryCountStore.removeChangeListener(this._onChange);
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
      <div className="country-count">
        <YearSlider store={countryCountStore} minYear={1960} maxYear={2014}/>
        <div className="country-count-container">
          <CountryCountPerYear height="500" width="960"/>
        </div>
      </div>
    );
  }

}

export default CountryPage;
