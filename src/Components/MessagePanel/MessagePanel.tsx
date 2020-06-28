import React, { Fragment, useEffect, useState } from 'react';
import MessageHeader from './MessageHeader/MessageHeader';
import MessageForm from './MessageForm/MessageForm';
import { Segment, Comment } from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import InnerMessage from './InnerMessage/InnerMessage';

interface IComponentProps {
  currentChannel: any;
  currentUser: any;
  isPrivateChannel: boolean;
}

interface IMessage {
  content?: string;
  image?: string;
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
  isPrivateChannel,
}) => {
  const [state, setState] = useState({
    privateChannel: isPrivateChannel,
    messageRef: MyFirebase.database().ref('messages'),
    privateMessagesRef: MyFirebase.database().ref('privateMessages'),
    messages: [],
    messagesLoading: true,
    numOfUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
  });

  useEffect(() => {
    const addEventListner = (channelId: string) => {
      addMessageListner(channelId);
    };

    const createMessageRef = () => {
      return state.privateChannel ? state.privateMessagesRef : state.messageRef;
    };

    const addMessageListner = (channelId: string) => {
      const loadedMesage: any = [];
      const ref = createMessageRef();
      ref.child(channelId).on('child_added', (snap) => {
        loadedMesage.push(snap.val());
        setState((prevState) => {
          return {
            ...prevState,
            messages: loadedMesage,
            messagesLoading: false,
          };
        });
        countUniqueUser(loadedMesage);
      });
    };
    if (currentChannel && currentUser) {
      addEventListner(currentChannel.id);
    }
  }, [
    state.messageRef,
    state.privateChannel,
    state.privateMessagesRef,
    currentChannel,
    currentUser,
  ]);

  const countUniqueUser = (messages: [IMessage]) => {
    const uniqueUser = messages.reduce((accumulator: any, currentValue) => {
      if (!accumulator.includes(currentValue.creator.name)) {
        accumulator.push(currentValue.creator.name);
      }
      return accumulator;
    }, []);
    const isPlural = uniqueUser.length > 1 || uniqueUser.length === 0;
    const numOfUniqueUsers = `${uniqueUser.length} user${isPlural ? 's' : ''}`;
    setState((prevState: any) => {
      return { ...prevState, numOfUniqueUsers };
    });
  };

  const displayChannelName = (channel: any) =>
    channel ? `${state.privateChannel ? '@' : '#'}${channel.name}` : '';

  const handleSearchChange = (event: any) => {
    event.persist();
    setState((prevState: any) => {
      return {
        ...prevState,
        searchTerm: event.target.value,
        searchLoading: true,
      };
    });
    const channelMessages = [...state.messages];
    const regex = new RegExp(state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce(
      (accumulator: any, currentValue: IMessage) => {
        if (
          (currentValue.content && currentValue.content.match(regex)) ||
          currentValue.creator.name.match(regex)
        ) {
          accumulator.push(currentValue);
        }
        return accumulator;
      },
      []
    );
    setState((prevState: any) => {
      return { ...prevState, searchResults };
    });
    setTimeout(() => {
      setState((prevState: any) => {
        return { ...prevState, searchLoading: false };
      });
    }, 1000);
  };

  const getMessagesRef = () => {
    const { messageRef, privateMessagesRef, privateChannel } = state;

    return privateChannel ? privateMessagesRef : messageRef;
  };

  return (
    <Fragment>
      <MessageHeader
        channelName={displayChannelName(currentChannel)}
        numOfUniqueUsers={state.numOfUniqueUsers}
        searchLoading={state.searchLoading}
        onChangeHandler={handleSearchChange}
        isPrivateChannel={state.privateChannel}
      />

      <Segment>
        <Comment.Group className='messages'>
          {state.searchTerm
            ? state.searchResults.length > 0 &&
              state.searchResults.map((message: IMessage) => (
                <InnerMessage
                  key={message.timestamp}
                  message={message}
                  user={currentUser}
                />
              ))
            : state.messages.length > 0 &&
              state.messages.map((message: IMessage) => (
                <InnerMessage
                  key={message.timestamp}
                  message={message}
                  user={currentUser}
                />
              ))}
        </Comment.Group>
      </Segment>

      <MessageForm
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={state.privateChannel}
        messageRef={getMessagesRef}
      />
    </Fragment>
  );
};

export default MessagePanel;
