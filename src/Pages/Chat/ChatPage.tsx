import React from 'react';
import { ColorPanel, MessagePanel, MetaPanel, SidePanel } from 'Components';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

const ChatPage = ({ currentUser, currentChannel }: any) => {
  return (
    <Grid columns='equal' className='ChatPage' style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <MessagePanel
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.user.data,
  currentChannel: state.channel.data,
});

export default connect(mapStateToProps)(ChatPage);
