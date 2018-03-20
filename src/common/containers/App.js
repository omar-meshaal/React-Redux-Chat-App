import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {initEnvironment} from '../actions/actions';
import * as actions from '../actions/actions';

class App extends React.Component {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(initEnvironment());
  }
  render() {
    const {screenHeight, screenWidth} = this.props.environment;
    return (
      <div style={{height: '100%'}} >
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    environment: state.environment
  }
}

export default connect(mapStateToProps)(App)
