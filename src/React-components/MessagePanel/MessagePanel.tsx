import React, { Fragment, useEffect, useState } from 'react';
import MessageHeader from './MessageHeader/MessageHeader';
import MessageForm from './MessageForm/MessageForm';
import { Segment, Comment } from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import InnerMessage from './InnerMessage/InnerMessage';
import { connect } from 'react-redux';
import { setUserPosts } from 'Redux-store/Redux-actions';
import { IMessage } from 'Global-interfaces';
import TypingComponent from './Typing/TypingComponent';

interface IProps {
  currentChannel: any;
  currentUser: any;
  isPrivateChannel: boolean;
  setUserPosts: any;
}

const MessagePanel: React.FC<IProps> = ({
  currentChannel,
  currentUser,
  isPrivateChannel,
  setUserPosts,
}) => {
  const [state, setState] = useState({
    privateChannel: isPrivateChannel,
    messageRef: MyFirebase.database().ref('messages'),
    privateMessagesRef: MyFirebase.database().ref('privateMessages'),
    usersRef: MyFirebase.database().ref('users'),
    messages: [],
    messagesLoading: true,
    numOfUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false,
    typingRef: MyFirebase.database().ref('typing'),
    typingUsers: [],
    connectedRef: MyFirebase.database().ref('.info/connected'),
  });

  useEffect(() => {
    const addEventListner = (channelId: string) => {
      addMessageListner(channelId);
      addTypingEventListener(channelId);
    };

    const addTypingEventListener = (channelId: string) => {
      let typingUsers: any[] = [];
      state.typingRef.child(channelId).on('child_added', (snap) => {
        if (snap.key !== currentUser.uid) {
          typingUsers = typingUsers.concat({
            id: snap.key,
            name: snap.val(),
          });
          setState((prevState: any) => {
            return { ...prevState, typingUsers };
          });
        }
      });

      state.typingRef.child(channelId).on('child_removed', (snap) => {
        const index = typingUsers.findIndex((user) => user.id === snap.key);
        if (index !== -1) {
          typingUsers = typingUsers.filter((user) => user.id !== snap.key);
          setState((prevState: any) => {
            return { ...prevState, typingUsers };
          });
        }
      });

      state.connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
          state.typingRef
            .child(channelId)
            .child(currentUser.uid)
            .onDisconnect()
            .remove((err) => {
              if (err !== null) {
                console.error(err);
              }
            });
        }
      });
    };

    const createMessageRef = () => {
      return state.privateChannel ? state.privateMessagesRef : state.messageRef;
    };

    const countUserPosts = (messages: [IMessage]) => {
      let userPosts = messages.reduce((acc: any, message) => {
        if (message.creator.name in acc) {
          acc[message.creator.name].count += 1;
        } else {
          acc[message.creator.name] = {
            avatar: message.creator.avataar,
            count: 1,
          };
        }
        return acc;
      }, {});
      setUserPosts(userPosts);
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
        countUserPosts(loadedMesage);
      });
    };

    const addUserStarListners = (channelId: string, userUid: string) => {
      state.usersRef
        .child(userUid)
        .child('starred')
        .once('value')
        .then((data) => {
          if (data.val() !== null) {
            const channelIds = Object.keys(data.val());
            const prevStarred = channelIds.includes(channelId);
            setState((prevState: any) => {
              return { ...prevState, isChannelStarred: prevStarred };
            });
          }
        });
    };

    if (currentChannel && currentUser) {
      addEventListner(currentChannel.id);
      addUserStarListners(currentChannel.id, currentUser.uid);
    }
  }, [
    state.messageRef,
    state.privateChannel,
    state.privateMessagesRef,
    state.usersRef,
    state.connectedRef,
    state.typingRef,
    currentChannel,
    currentUser,
    setUserPosts,
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

  const handleStar = () => {
    setState((prevState: any) => {
      return { ...prevState, isChannelStarred: !state.isChannelStarred };
    });
    starringChannel(!state.isChannelStarred);
  };

  const starringChannel = (passedValue: boolean) => {
    if (passedValue) {
      // Handle Starred Event
      currentChannel &&
        state.usersRef.child(`${currentUser.uid}/starred`).update({
          [currentChannel.id]: {
            name: currentChannel.name,
            detail: currentChannel.detail,
            createdBy: {
              name: currentChannel.createdBy.name,
              avatar: currentChannel.createdBy.avatar,
            },
          },
        });
    } else {
      // Handle UnStarred Event
      currentChannel &&
        state.usersRef
          .child(`${currentUser.uid}/starred`)
          .child(currentChannel.id)
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
    }
  };

  const displayTypingUsers = (typingUsers: any[]) => {
    return (
      typingUsers.length > 0 &&
      typingUsers.map((user) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.2em',
          }}
          key={user.id}
        >
          <span className='user__typing'>{user.name} is typing</span>
          <TypingComponent />
        </div>
      ))
    );
  };

  return (
    <Fragment>
      <MessageHeader
        isChannelStarred={state.isChannelStarred}
        handleStar={handleStar}
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
          {displayTypingUsers(state.typingUsers)}
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

export default connect(null, { setUserPosts })(MessagePanel);
