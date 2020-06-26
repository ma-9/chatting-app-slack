import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from 'Redux/Actions';

interface IComponentProps {
  currentUser: any;
  setCurrentChannel: any;
  setPrivateChannel: any;
}

class DirectMessages extends Component<IComponentProps> {
  state = {
    user: this.props.currentUser,
    users: [],
    userRef: MyFirebase.database().ref('users'),
    connectedRef: MyFirebase.database().ref('.info/connected'),
    presenseRef: MyFirebase.database().ref('presence'),
  };

  componentDidMount() {
    if (this.state.user) {
      this.addEventListners(this.state.user.uid);
    }
  }

  addEventListners = (currentUserId: string) => {
    const loadedUsers: any[] = [];
    this.state.userRef.on('child_added', (snap) => {
      if (currentUserId !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        const childRef = this.state.presenseRef.child(currentUserId);
        childRef.set(true);
        childRef.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenseRef.on('child_added', (snap: any) => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenseRef.on('child_removed', (snap: any) => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userID: string, connected = true) => {
    const updatedUsers = this.state.users.reduce(
      (accumulator: any, currentValue: any) => {
        if (currentValue.uid === userID) {
          currentValue['status'] = `${connected ? 'online' : 'offline'}`;
        }
        return accumulator.concat(currentValue);
      },
      []
    );
    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user: any) => {
    return user.status === 'online';
  };

  changeChannel = (user: any) => {
    const channelId = this.getChannelID(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  };

  getChannelID = (userId: string) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='mail' /> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {this.state.users.map((user: any) => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon
              inverted
              name='circle'
              color={this.isUserOnline(user) ? 'green' : 'red'}
            />
            {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
