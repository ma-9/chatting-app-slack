import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { LoginPage, RegisterationPage, LandingPage } from 'Pages';
import { MyFirebase } from 'Config';
import { setUser, clearUser } from 'Redux-store/Redux-actions';

import { connect } from 'react-redux';
import { Loader, Dimmer } from 'semantic-ui-react';

class rootApp extends Component<any> {
  componentDidMount() {
    MyFirebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.loading ? (
      <Dimmer active>
        <Loader size='huge' content={'Preparing for Chat'} />
      </Dimmer>
    ) : (
      <Switch>
        <Route path='/' exact component={LandingPage} />
        <Route path='/register' exact component={RegisterationPage} />
        <Route path='/login' exact component={LoginPage} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: any) => ({
  loading: state.user.loading,
});

export default withRouter(
  connect(mapStateToProps, { setUser, clearUser })(rootApp)
);
