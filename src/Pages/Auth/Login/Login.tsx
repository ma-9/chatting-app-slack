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

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  handleOnChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  formValidation = ({ email, password }: any) => email && password;

  handleOnSubmit = (event: any) => {
    event.preventDefault();
    if (this.formValidation(this.state)) {
      this.setState({ errors: [], loading: true });
      MyFirebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          console.log(signedInUser);
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

  handleInputError = (errors: any, inputName: string) => {
    return errors.some((error: any) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  render() {
    return (
      <Grid textAlign='center' verticalAlign='middle' className='login-page'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='violet' textAlign='center'>
            <Icon name='code branch' color='violet' />
            Login to DevChat
          </Header>
          <Form size='large' onSubmit={this.handleOnSubmit}>
            <Segment stacked>
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
              <Button
                disabled={this.state.loading}
                className={this.state.loading ? 'loading' : ''}
                color='violet'
                size='large'
                fluid
              >
                Login
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
            Don't have an account? <Link to='/register'>Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default LoginPage;
