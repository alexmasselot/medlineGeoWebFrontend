/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './DetailsCountry.css';
import withStyles from '../../decorators/withStyles';
import countryDefsStore from '../../stores/CountryDefsStore';

@withStyles(styles)
class Details extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

 _onChange() {
    this.setState({country:countryDefsStore.getCountryFocus()})
  }

  componentDidMount() {
    var _this = this;
    countryDefsStore.addChangeListener(function(){
      _this._onChange();
    });
  }

  componentWillUnmount() {
    countryDefsStore.removeChangeListener(this._onChange);
  }

  render() {
    let _this = this;
    let country = _this.state && _this.state.country;
    if(!country){
      return <div></div>;
    }
    return (
      <div className='DetailsCountry' >
        <img src={'images/flags_iso/48/'+country.iso_a2.toLowerCase()+'.png'}></img>
        <h3>{country.name}</h3>
      </div>
    );
  }

}

export default Details;
