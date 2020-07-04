import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  Input,
  ModalActions,
  Button,
  Icon,
} from 'semantic-ui-react';
import mime from 'mime-types';

interface IProps {
  open: boolean;
  closeModal: any;
  uploadMedia: any;
}

class FileModal extends Component<IProps> {
  state = {
    file: null,
    authorized: ['image/jpg', 'image/png', 'image/jpeg'],
  };

  handleOnFileSelect = (event: any) => {
    const file = event.target.files[0];
    this.setState({ file });
  };

  isAuthorizedFile = (fileName: any) => {
    const mimeLookup: any = mime.lookup(fileName);
    return this.state.authorized.includes(mimeLookup);
  };

  handleUploadMedia = () => {
    const { file }: any = this.state;
    const { uploadMedia, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorizedFile(file.name)) {
        const metaData = { contentType: mime.lookup(file.name) };
        uploadMedia(file, metaData);
        closeModal();
        this.handleClearFile();
      } else {
        console.log(
          'Authorized Error (Invalid File Selected, pls select png or jpg only)'
        );
      }
    } else {
      console.log('file selection Error');
    }
  };

  handleClearFile = () => {
    this.setState({ file: null });
  };

  render() {
    const { closeModal, open } = this.props;
    return (
      <Modal basic open={open} onClose={closeModal}>
        <ModalHeader>Select an Image File</ModalHeader>
        <ModalContent>
          <Input
            fluid
            label='file type recommended: jpg, png'
            type='file'
            name='file'
            onChange={this.handleOnFileSelect}
          />
        </ModalContent>
        <ModalActions>
          <Button color='green' inverted onClick={this.handleUploadMedia}>
            <Icon name='checkmark' /> Send
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

export default FileModal;
