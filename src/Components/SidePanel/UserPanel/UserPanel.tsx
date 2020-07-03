import React, { Component } from 'react';
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Dropdown,
  Image,
} from 'semantic-ui-react';
import { MyFirebase } from 'Config';

interface IProps {
  currentUser: any;
  primaryColor: string;
}

class UserPanel extends Component<IProps> {
  state = {
    user: this.props.currentUser,
  };
  dropDownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>,
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignOut}>Sign Out</span>,
    },
  ];

  handleSignOut = () => {
    MyFirebase.auth()
      .signOut()
      .then(() => {
        console.log('Signned Out Successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <Grid style={{ background: this.props.primaryColor }}>
        <GridColumn>
          <GridRow style={{ padding: '1.2rem', margin: 0 }}>
            {/* App Header */}
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <HeaderContent>DevChat</HeaderContent>
            </Header>
            {/* User Dropdown */}
            <Header inverted style={{ padding: '0.25em' }} as='h4'>
              <Dropdown
                trigger={
                  <span>
                    <Image
                      spaced='right'
                      src={this.state.user.photoURL}
                      avatar
                    />
                    {this.state.user.displayName}
                  </span>
                }
                options={this.dropDownOptions()}
              />
            </Header>
          </GridRow>
        </GridColumn>
      </Grid>
    );
  }
}

export default UserPanel;
