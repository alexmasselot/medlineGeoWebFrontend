/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Navigation from '../Navigation';

@withStyles(styles)
class Header extends Component {

  render() {
    return (
      <div className="Header row">
        <div className="Header-container">
          <a className="Header-brand" href="http://www.octo.ch">
           <img className="Header-brandImg" src="/images/swiss-cow-octo.png" height="38" alt="octo" />
            <span className="Header-brandTxt">Medline geo</span>
          </a>
          <Navigation className="Header-nav" />

        </div>
      </div>
    );
  }

}

export default Header;
