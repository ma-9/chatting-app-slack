import React from 'react';
import {
  Comment,
  CommentAvatar,
  CommentContent,
  CommentAuthor,
  CommentMetadata,
  CommentText,
  Image,
} from 'semantic-ui-react';
import moment from 'moment';
import { IMessage, IUser } from 'Global-interfaces';

interface IProps {
  message: IMessage;
  user: IUser;
}

const isOwnMessage = (message: IMessage, user: IUser) => {
  return message.creator.id === user.uid ? 'message__self' : '';
};

const isImage = (message: IMessage) => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
};

const timeFromNow = (time: string) => moment(time).fromNow();

const InnerMessage: React.FC<IProps> = ({ message, user }) => {
  return (
    <Comment>
      <CommentAvatar src={message.creator.avataar} />
      <CommentContent className={isOwnMessage(message, user)}>
        <CommentAuthor as='a'> {message.creator.name} </CommentAuthor>
        <CommentMetadata> {timeFromNow(message.timestamp)} </CommentMetadata>
        {isImage(message) ? (
          <Image src={message.image} className='message__image' />
        ) : (
          <CommentText> {message.content} </CommentText>
        )}
      </CommentContent>
    </Comment>
  );
};

export default InnerMessage;
