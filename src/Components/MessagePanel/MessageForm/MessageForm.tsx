import React, { useState, useEffect } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import { MyFirebase } from 'Config';

import FileModal from '../FileModal/FileModal';
import ProgressBar from '../ProgressBar/ProgressBar';

interface IComponentProps {
  currentChannel: any;
  currentUser: any;
}

interface IComponentState {
  message: string;
  loading: boolean;
  error: any;
  isModalOpen: boolean;
  uploadState: string;
  uploadTask: any;
  messageRef: any;
  percentUploaded: number;
  currentChannel: any;
  currentUser: any;
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
    isModalOpen: false,
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    currentChannel,
    currentUser,
  });

  const handleOpenModal = () => {
    setState((prevState) => {
      return { ...prevState, isModalOpen: true };
    });
  };

  const handleCloseModal = () => {
    setState((prevState) => {
      return { ...prevState, isModalOpen: false };
    });
  };

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

  const handleUploadMedia = (file: any, metaData: any) => {
    const filePath = `chat/public/${uuidv4()}.jpg`;
    setState((prevState: any) => {
      return {
        ...prevState,
        uploadState: 'uploading',
        uploadTask: MyFirebase.storage()
          .ref()
          .child(filePath)
          .put(file, metaData),
      };
    });
  };

  useEffect(() => {
    if (state.uploadTask !== null) {
      state.uploadTask.on('state_changed', (snap: any) => {
        const percentUploaded = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setState((prevState: any) => {
          return { ...prevState, percentUploaded };
        });
      });
    }
  }, [state.uploadTask]);

  useEffect(() => {
    const sendFileToMessage = (
      downloadURL: any,
      ref: any,
      pathToUpload: any
    ) => {
      ref
        .child(pathToUpload)
        .push()
        .set({
          image: downloadURL,
          timestamp: MyFirebase.database.ServerValue.TIMESTAMP,
          creator: {
            id: state.currentUser.uid,
            name: state.currentUser.displayName,
            avataar: state.currentUser.photoURL,
          },
        })
        .then(() => {
          setState((prevState: any) => {
            return {
              ...prevState,
              uploadState: 'done',
              uploadTask: null,
              percentUploaded: 0,
            };
          });
        })
        .catch((err: any) => {
          setState((prevState: any) => {
            return {
              ...prevState,
              error: state.error.concat(err),
            };
          });
        });
    };

    try {
      state.percentUploaded === 100 &&
        state.uploadTask.snapshot.ref
          .getDownloadURL()
          .then((downloadURL: string) => {
            sendFileToMessage(
              downloadURL,
              state.messageRef,
              state.currentChannel.id
            );
          })
          .catch((err: any) => {
            console.error(err);
            setState((prevState: any) => {
              return {
                ...prevState,
                error: state.error.concat(err),
                uploadState: 'error',
                uploadTask: null,
              };
            });
          });
    } catch (error) {
      console.warn(error);
      alert(
        'Something went wrong with this file. Please try with different one'
      );
    }
  }, [
    state.currentChannel,
    state.currentUser,
    state.percentUploaded,
    state.messageRef,
    state.error,
    state.uploadTask,
  ]);

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
          disabled={state.uploadState === 'uploading'}
          onClick={handleOpenModal}
        />
      </Button.Group>
      <FileModal
        open={state.isModalOpen}
        closeModal={handleCloseModal}
        uploadMedia={handleUploadMedia}
      />
      <ProgressBar
        percentUploaded={state.percentUploaded}
        uploadState={state.uploadState}
      />
    </Segment>
  );
};

export default MessageForm;
