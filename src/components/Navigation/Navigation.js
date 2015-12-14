/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

@withStyles(styles)
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <a className="Navigation-link" href="/all" onClick={Link.handleClick}>all</a>
        <a className="Navigation-link" href="/hexamap" onClick={Link.handleClick}>per location</a>
        <a className="Navigation-link" href="/country" onClick={Link.handleClick}>per country</a>
        <a className="Navigation-link" href="/country-pairs" onClick={Link.handleClick}>per country collaboration</a>
        <span className="Navigation-spacer"> | </span>
      </div>
    );
  }

}

export default Navigation;
