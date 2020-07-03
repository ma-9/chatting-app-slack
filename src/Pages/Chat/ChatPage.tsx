import React from 'react';
import { ColorPanel, MessagePanel, MetaPanel, SidePanel } from 'Components';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ChatPage = ({
  currentUser,
  currentChannel,
  isPrivateChannel,
  userPosts,
  primaryColor,
  secondaryColor,
}: any) => {
  return (
    <Grid
      columns='equal'
      className='ChatPage'
      style={{ background: secondaryColor }}
    >
      <ColorPanel
        key={currentUser && currentUser.id}
        currentUser={currentUser}
      />
      <SidePanel currentUser={currentUser} primaryColor={primaryColor} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <MessagePanel
          isPrivateChannel={isPrivateChannel}
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel
          userPosts={userPosts}
          currentChannel={currentChannel}
          key={currentChannel && currentChannel.name}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.user.data,
  currentChannel: state.channel.data,
  isPrivateChannel: state.channel.privateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.color.primaryColor,
  secondaryColor: state.color.secondaryColor,
});

export default connect(mapStateToProps)(ChatPage);
