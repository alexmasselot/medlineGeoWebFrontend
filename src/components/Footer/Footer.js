/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './Footer.css';
import withViewport from '../../decorators/withViewport';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import d3 from 'd3';

@withViewport
@withStyles(styles)
class Footer extends Component {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  };

  render() {

    const { width, height } = this.props.viewport;

    return (
      <div className="Footer row">
        <div className="Footer-container">
          <span className="Footer-text">Email: <a href="mailto:amasselot@octo.com">Alexandre Masselot</a> </span>
          <span className="Footer-spacer">·</span>
          <span className="Footer-text">© <a href="http://www.octo.ch">OCTO Technology Suisse</a> </span>
        </div>
      </div>
    );
  }

}

export default Footer;
