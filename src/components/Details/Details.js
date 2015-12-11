/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './Details.css';
import withStyles from '../../decorators/withStyles';
import DetailsCountry from '../DetailsCountry';

@withStyles(styles)
class Details extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className='Details' >
        <DetailsCountry/>
      </div>
    );
  }

}

export default Details;
