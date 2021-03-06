import React from 'react';
import UserPanel from './UserPanel/UserPanel';
import ChannelPanel from './Channels/ChannelComponent';
import DirectMessageComponent from './DirectMessages/DirectMessages';
import { Menu } from 'semantic-ui-react';
import StarredChannelComponent from './StarredChannels/StarredChannel.component';

const SidePanel = ({ currentUser, primaryColor }: any) => {
  return (
    <Menu
      size='large'
      inverted
      fixed='left'
      vertical
      style={{ background: primaryColor, fontSize: '1.2rem' }}
    >
      <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
      <StarredChannelComponent currentUser={currentUser} />
      <ChannelPanel currentUser={currentUser} />
      <DirectMessageComponent currentUser={currentUser} />
    </Menu>
  );
};

export default SidePanel;
