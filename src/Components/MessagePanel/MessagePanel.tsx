import React, { Fragment } from 'react';
import MessageHeader from './MessageHeader/MessageHeader';
import MessageForm from './MessageForm/MessageForm';
import { Segment, Comment } from 'semantic-ui-react';

const MessagePanel = () => {
  return (
    <Fragment>
      <MessageHeader />

      <Segment>
        <Comment.Group className='messages'>{/* Messages */}</Comment.Group>
      </Segment>

      <MessageForm />
    </Fragment>
  );
};

export default MessagePanel;
