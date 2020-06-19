import React, { Component } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Message,
  Header,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { MyFirebase } from 'Config';

class RegisterationPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    userRef: MyFirebase.database().ref('users'),
  };

  handleOnChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  formIsNotEmpty = ({
    username,
    email,
    password,
    passwordConfirmation,
  }: any) => {
    return (
      username.length > 1 ||
      email.length > 1 ||
      password.length > 1 ||
      passwordConfirmation.length > 1
    );
  };

  passwordValidation = ({ password, passwordConfirmation }: any) => {
    if (password.lenth < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  formValidation = () => {
    let errors: any = [];
    let error;
    if (!this.formIsNotEmpty(this.state)) {
      error = { message: 'Fill all the fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.passwordValidation(this.state)) {
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  handleOnSubmit = (event: any) => {
    event.preventDefault();
    if (this.formValidation()) {
      this.setState({ errors: [], loading: true });
      MyFirebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          createdUser.user
            ?.updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${createdUser.user.email}?d=identicon`,
            })
            .then(() => {
              this.handleSaveUser(createdUser).then(() => {
                console.log('User Saved');
              });
            })
            .catch((err) => {
              console.warn(err);
              this.setState({
                loading: false,
                errors: this.state.errors.concat(err),
              });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    }
  };

  handleSaveUser = (createdUser: any) => {
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  handleInputError = (errors: any, inputName: string) => {
    return errors.some((error: any) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  render() {
    return (
      <Grid textAlign='center' verticalAlign='middle' className='register-page'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register For DevChat
          </Header>
          <Form size='large' onSubmit={this.handleOnSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                className={this.handleInputError(this.state.errors, 'username')}
                onChange={this.handleOnChange}
                type='text'
              />
              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                className={this.handleInputError(this.state.errors, 'email')}
                onChange={this.handleOnChange}
                type='email'
              />
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                className={this.handleInputError(this.state.errors, 'password')}
                onChange={this.handleOnChange}
                type='password'
              />
              <Form.Input
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                className={this.handleInputError(this.state.errors, 'password')}
                onChange={this.handleOnChange}
                type='password'
              />
              <Button
                disabled={this.state.loading}
                className={this.state.loading ? 'loading' : ''}
                color='orange'
                size='large'
                fluid
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.state.errors.map((error: any, i) => (
                <p key={i}> {error.message} </p>
              ))}
            </Message>
          )}
          <Message>
            Already a User? <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default RegisterationPage;
