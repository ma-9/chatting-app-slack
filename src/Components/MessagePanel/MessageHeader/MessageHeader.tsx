import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

const MessageHeader = () => {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header floated='left' fluid='true' as='h2' style={{ marginBottom: 0 }}>
        <span>
          Channel
          <Icon name='star outline' color='black' />
        </span>
      </Header>

      {/* Channel Search input */}
      <Header floated='right'>
        <Input
          size='mini'
          icon='search'
          name='searchItem'
          placeholder='Search Messages'
        />
      </Header>
    </Segment>
  );
};

export default MessageHeader;
