import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Input, Button } from 'react-bootstrap';

import { welcomePage } from '../actions/actions';
import SignIn from './SignIn';

class WelcomePage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }
  componentDidMount() {
    this.refs.usernameInput.getInputDOMNode().focus();
  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
  }
  handleSubmit() {
    const { dispatch } = this.props;
    const username = this.state.username;
    dispatch(welcomePage(username));
    this.setState({ username: '' });
  }
  render() {
    const { screenWidth } = this.props;
    return (
      <div>
        <header style={{ display: 'flex', justifyContent: 'center', flexGrow: '0', order: '0' }}>
          <div style={{ justifyContent: 'center' }}><p style={{ fontSize: '1.5em', marginRight: '1em' }}>Welcome to React Redux Chat</p>
          </div>
        </header>
        <main style={{ display: 'flex', justifyContent: 'center' }}>

          <form style={{ height: '20rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ margin: 'auto', paddingRight: '0.2em', height: '3.5em' }}>
              <Input
                style={{ height: '2.7em', fontSize: '1.3em' }}
                ref="usernameInput"
                type="text"
                name="username"
                value={this.state.username}
                placeholder="Enter username"
                onChange={this.handleChange.bind(this)}
              />
            </div>
            <section style={{ margin: 'auto', width: '12em', height: '3.5em' }}>
              <Link to="/signup">
                <Button
                  bsStyle="primary"
                  style={{ margin: 'auto', width: '12em', height: '3.5em' }}
                  type="submit"
                  onClick={this.handleSubmit.bind(this)}>
                  <p style={{ margin: '0', padding: '0', fontSize: '1.5em' }}>Sign Up</p>
                </Button>
              </Link>
            </section>
          </form>
          <div style={{ height: '3.5em', width: '12em', alignSelf: 'center', display: 'flex', marginLeft: '1em' }}>
            <Link to="/signin">
              <Button bsStyle="primary" style={{ margin: 'auto', width: '12em', height: '3.5em' }} >
                <p style={{ margin: '0', padding: '0', fontSize: '1.5em' }}>Sign in</p>
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    screenWidth: state.environment.screenWidth
  }
}

export default connect(mapStateToProps)(WelcomePage)
