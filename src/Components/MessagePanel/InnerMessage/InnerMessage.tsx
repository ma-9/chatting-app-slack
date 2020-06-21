import React from 'react';
import {
  Comment,
  CommentAvatar,
  CommentContent,
  CommentAuthor,
  CommentMetadata,
  CommentText,
} from 'semantic-ui-react';
import moment from 'moment';

interface IComponentProps {
  message: IMessage;
  user: IUser;
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

interface IUser {
  uid: string;
  photoURL: string;
  displayName: string;
}

const isOwnMessage = (message: IMessage, user: IUser) => {
  return message.creator.id === user.uid ? 'message__self' : '';
};

const timeFromNow = (time: string) => moment(time).fromNow();

const InnerMessage: React.FC<IComponentProps> = ({ message, user }) => {
  return (
    <Comment>
      <CommentAvatar src={message.creator.avataar} />
      <CommentContent className={isOwnMessage(message, user)}>
        <CommentAuthor as='a'> {message.creator.name} </CommentAuthor>
        <CommentMetadata> {timeFromNow(message.timestamp)} </CommentMetadata>
        <CommentText> {message.content} </CommentText>
      </CommentContent>
    </Comment>
  );
};

export default InnerMessage;
