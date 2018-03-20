import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import * as authActions from '../actions/authActions';

class SignIn extends Component {

  static propTypes = {
    welcomePage: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    signInError: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.welcomePage || '',
      password: '',
      signInError: null
    };
  }

  componentDidMount() {
    if (this.state.username.length) {
      this.refs.passwordInput.getInputDOMNode().focus();
    } else {
      this.refs.usernameInput.getInputDOMNode().focus();
    }
  }

  validateUser() {
    const { signInError } = this.props;
    if (signInError != null) {
      return 'error';
    }
    return 'success';
  }

  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value });
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    if (this.state.username.length < 1) {
      this.refs.usernameInput.getInputDOMNode().focus();
    }
    if (this.state.username.length > 0 && this.state.password.length < 1) {
      this.refs.passwordInput.getInputDOMNode().focus();
    }
    if (this.state.username.length > 0 && this.state.password.length > 0) {
      var userObj = {
        username: this.state.username,
        password: this.state.password
      };
      dispatch(authActions.signIn(userObj))
      this.setState({ username: '', password: ''});
    }
  }
  render() {
    return (
      <div>
        <header style={{display: 'flex', justifyContent: 'center', background: '#000000', color: '#FFFFFF', flexGrow: '0', order: '0'}}>
          Sign In to Chat
        </header>
        <main style={{display: 'flex', justifyContent: 'center'}}>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <Input
              label="Username"
              ref="usernameInput"
              type="text"
              name="username"
              placeholder="Enter username"
              help={this.validateUser() === 'error' && this.props.signInError}
              bsStyle={this.validateUser()}
              value={this.state.username}
              onChange={this.handleChange.bind(this)}
            />
            <Input
              label="Password"
              ref="passwordInput"
              type="password"
              name="password"
              placeholder="Enter password"
              value={this.state.password}
              onChange={this.handleChange.bind(this)}
            />
            <Button
              bsStyle="primary"
              style={{width: '100%', height: '4rem', marginTop: '2rem'}} name="submitButton"
              type="submit" >
                <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}} >Sign In</p>
            </Button>
          </form>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      welcomePage: state.welcomePage,
      signInError: state.auth.signInError
  }
}
export default connect(mapStateToProps)(SignIn)
