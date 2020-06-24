import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader';

interface IComponentProps {
  channelName: string;
  numOfUniqueUsers: string;
  searchLoading: boolean;
  onChangeHandler: any;
}

const MessageHeader: React.FC<IComponentProps> = ({
  channelName,
  numOfUniqueUsers,
  searchLoading,
  onChangeHandler,
}) => {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header floated='left' fluid='true' as='h2' style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name='star outline' color='black' />
        </span>
        <HeaderSubHeader>{numOfUniqueUsers} </HeaderSubHeader>
      </Header>

      {/* Channel Search input */}
      <Header floated='right'>
        <Input
          loading={searchLoading}
          onChange={onChangeHandler}
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