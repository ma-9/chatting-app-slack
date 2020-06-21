import React, { Fragment, useEffect, useState } from 'react';
import MessageHeader from './MessageHeader/MessageHeader';
import MessageForm from './MessageForm/MessageForm';
import { Segment, Comment } from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import InnerMessage from './InnerMessage/InnerMessage';

interface IComponentProps {
  currentChannel: any;
  currentUser: any;
}

interface IMessage {
  content: string;
  creator: {
    id: string;
    avataar: string;
    name: string;
  };
  timestamp: string;
}

const MessagePanel: React.FC<IComponentProps> = ({
  currentChannel,
  currentUser,
}) => {
  const [state, setState] = useState({
    messageRef: MyFirebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
  });

  useEffect(() => {
    if (currentChannel && currentUser) {
      addEventListner(currentChannel.id);
    }
  }, []);

  const addEventListner = (channelId: string) => {
    addMessageListner(channelId);
  };

  const addMessageListner = (channelId: string) => {
    const loadedMesage: any = [];
    state.messageRef.child(channelId).on('child_added', (snap) => {
      loadedMesage.push(snap.val());
      setState((prevState) => {
        return { ...prevState, messages: loadedMesage, messagesLoading: false };
      });
    });
  };

  return (
    <Fragment>
      <MessageHeader />

      <Segment>
        <Comment.Group className='messages'>
          {state.messages.length > 0 &&
            state.messages.map((message: IMessage) => (
              <InnerMessage
                key={message.timestamp}
                message={message}
                user={currentUser}
              />
            ))}
        </Comment.Group>
      </Segment>

      <MessageForm currentChannel={currentChannel} currentUser={currentUser} />
    </Fragment>
  );
};

export default MessagePanel;
