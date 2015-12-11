/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './CountryPage.css';
import withStyles from '../../decorators/withStyles';
import countryCountStore from '../../stores/CountryCountStore';
import CountryCountPerYear from '../CountryCountPerYear/CountryCountPerYear';
import YearSlider from '../YearSlider/YearSlider';
import Dimensions from 'react-dimensions';

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
      <div className="country-count graph-layout">
        <YearSlider store={countryCountStore} minYear={1960} maxYear={2014}/>
        <div className="country-count-container">
          <CountryCountPerYear height={_this.props.containerHeight-28} width={_this.props.containerWidth}/>
        </div>
      </div>
    );
  }

}

export default Dimensions()(CountryPage);
