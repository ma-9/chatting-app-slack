import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from 'Redux/Actions';
import { Menu, Icon } from 'semantic-ui-react';

interface IChannelProps {
  currentUser: {
    avatar: string;
    name: string;
  };
  detail: string;
  id: string;
  name: string;
}

interface IComponentProps {
  setCurrentChannel: any;
  setPrivateChannel: any;
}

class StarredChannelComponent extends Component<IComponentProps> {
  state = {
    starredChannels: [],
    activeChannelId: '',
  };

  setActiveChannel = (channel: IChannelProps) => {
    this.setState({ activeChannelId: channel.id });
  };

  handleChangeChannel = (channel: IChannelProps) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  displayChannel = (channel: any[]) =>
    channel.length > 0 &&
    channel.map((channel: IChannelProps, key) => (
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