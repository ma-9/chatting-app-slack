import React, { useState } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import { MyFirebase } from 'Config';

interface IComponentProps {
  currentChannel: any;
  currentUser: any;
}

interface IComponentState {
  message: string;
  loading: boolean;
  error: any;
  messageRef: any;
}

const MessageForm: React.FC<IComponentProps> = ({
  currentChannel,
  currentUser,
}) => {
  const [state, setState] = useState<IComponentState>({
    message: '',
    loading: false,
    error: [],
    messageRef: MyFirebase.database().ref('messages'),
  });

  const handleOnChange = (event: any) => {
    event.persist();
    setState((prevState) => {
      return { ...prevState, message: event.target.value };
    });
  };

  const handleOnSendMessage = () => {
    if (state.message) {
      setState((prevState) => {
        return { ...prevState, loading: true };
      });
      state.messageRef
        .child(currentChannel.id)
        .push()
        .set({
          content: state.message,
          timestamp: MyFirebase.database.ServerValue.TIMESTAMP,
          creator: {
            id: currentUser.uid,
            name: currentUser.displayName,
            avataar: currentUser.photoURL,
          },
        })
        .then(() => {
          setState((prevState: any) => {
            return {
              ...prevState,
              loading: false,
              message: '',
            };
          });
        })
        .catch((err: any) => {
          setState((prevState: any) => {
            return {
              ...prevState,
              loading: false,
              error: state.error.concat(err),
            };
          });
        });
    } else {
      setState((prevState: any) => {
        return {
          ...prevState,
          loading: false,
          error: state.error.concat({ message: 'Add a Reply' }),
        };
      });
    }
  };

  return (
    <Segment className='message__form'>
      <Input
        fluid
        name='message'
        onChange={handleOnChange}
        className={
          state.error.some((err: any) => err.message.toLowerCase() !== '')
            ? 'error'
            : ''
        }
        value={state.message}
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add' />}
        labelPosition='left'
        placeholder='Write your message'
      />
      <Button.Group icon widths='2'>
        <Button
          color='orange'
          content={state.loading ? 'Sending..' : 'Add Reply'}
          disabled={state.loading}
          labelPosition='left'
          onClick={handleOnSendMessage}
          icon='edit'
        />
        <Button
          color='teal'
          content='Upload Media'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
