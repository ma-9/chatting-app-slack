import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader';

interface IProps {
  channelName: string;
  numOfUniqueUsers: string;
  searchLoading: boolean;
  onChangeHandler: any;
  isPrivateChannel: boolean;
  handleStar: any;
  isChannelStarred: boolean;
}

const MessageHeader: React.FC<IProps> = ({
  channelName,
  numOfUniqueUsers,
  searchLoading,
  onChangeHandler,
  isPrivateChannel,
  handleStar,
  isChannelStarred,
}) => {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header floated='left' fluid='true' as='h2' style={{ marginBottom: 0 }}>
        <span>
          {channelName}{' '}
          {!isPrivateChannel &&
            (isChannelStarred ? (
              <Icon
                style={{ cursor: 'pointer', transition: '0.5s' }}
                className='activeStar'
                name='star'
                onClick={handleStar}
                color='orange'
              />
            ) : (
              <Icon
                onClick={handleStar}
                style={{ cursor: 'pointer', transition: '0.5s' }}
                name='star outline'
                color='black'
              />
            ))}
        </span>
        {!isPrivateChannel && (
          <HeaderSubHeader>{numOfUniqueUsers} </HeaderSubHeader>
        )}
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
