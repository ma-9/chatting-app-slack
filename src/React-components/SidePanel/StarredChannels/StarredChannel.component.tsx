import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setCurrentChannel,
  setPrivateChannel,
} from 'Redux-store/Redux-actions';
import { Menu, Icon } from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import { ICurrentUser, IChannel } from 'Global-interfaces';

interface IProps {
  setCurrentChannel: any;
  setPrivateChannel: any;
  currentUser: ICurrentUser;
}

class StarredChannelComponent extends Component<IProps> {
  state = {
    user: this.props.currentUser,
    userRef: MyFirebase.database().ref('users'),
    starredChannels: [],
    activeChannelId: '',
  };

  componentDidMount() {
    this.addEventListners(this.state.user.uid);
  }

  addEventListners = (userID: string) => {
    this.state.userRef
      .child(userID)
      .child('starred')
      .on('child_added', (snap) => {
        const starredChannels = { id: snap.key, ...snap.val() };
        this.setState({
          starredChannels: [...this.state.starredChannels, starredChannels],
        });
      });

    this.state.userRef
      .child(userID)
      .child('starred')
      .on('child_removed', (snap) => {
        const channelToBeRemoved = { id: snap.key };
        const filterChannels = this.state.starredChannels.filter(
          (channel: IChannel) => {
            return channel.id !== channelToBeRemoved.id;
          }
        );
        this.setState({
          starredChannels: filterChannels,
        });
      });
  };

  setActiveChannel = (channel: IChannel) => {
    this.setState({ activeChannelId: channel.id });
  };

  handleChangeChannel = (channel: IChannel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  displayChannel = (channel: any[]) =>
    channel.length > 0 &&
    channel.map((channel: IChannel, key) => (
      <Menu.Item
        key={key}
        onClick={() => this.handleChangeChannel(channel)}
        style={{ opacity: 0.7 }}
        name={channel.name}
        active={channel.id === this.state.activeChannelId}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    return (
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='star' /> STARRED
          </span>{' '}
          ({this.state.starredChannels.length}){' '}
        </Menu.Item>
        {this.displayChannel(this.state.starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  StarredChannelComponent
);
