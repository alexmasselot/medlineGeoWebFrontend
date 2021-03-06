/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import Details from '../Details';
import Legend from '../Legend';
import Dimensions from 'react-dimensions';


@withContext
@withStyles(styles)
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {

    let width = this.props.containerWidth;
    //remove header and footer heights
    let height = window.innerHeight -80 -60;

    return !this.props.error ? (
      <div >
        <Header />
        <div>{this.props.children}</div>
        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default Dimensions()(App);
