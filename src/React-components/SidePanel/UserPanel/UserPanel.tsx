import React, { Component } from 'react';
import {
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import AvatarEditor from 'react-avatar-editor';
import { ICurrentUser } from 'Global-interfaces';

interface IProps {
  currentUser: ICurrentUser;
  primaryColor: string;
}

interface IState {
  user: any;
  modal: boolean;
  previewImage: string | ArrayBuffer | null;
  croppedImage: string;
  blob: Blob;
  storageRef: any;
  userRef: any;
  usersRef: any;
  metadata: any;
  uploadedCropeedImage: string;
}

class UserPanel extends Component<IProps, IState> {
  public avatarEditor: any;

  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: new Blob(),
    storageRef: MyFirebase.storage().ref(),
    userRef: MyFirebase.auth().currentUser,
    usersRef: MyFirebase.database().ref('users'),
    metadata: {
      contentType: 'image/jpeg',
    },
    uploadedCropeedImage: '',
  };
  dropDownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span onClick={this.handleOpenModal}>Change Avatar</span>,
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignOut}>Sign Out</span>,
    },
  ];

  handleSignOut = () => {
    MyFirebase.auth()
      .signOut()
      .then(() => {
        console.log('Signned Out Successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleOpenModal = () => this.setState({ modal: true });

  handleCloseModal = () => this.setState({ modal: false });

  handleOnFileSelect = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob: any) => {
        let imageURL = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageURL,
          blob,
        });
      });
    }
  };

  handleImageUploadToFirebase = () => {
    const { storageRef, user, blob, metadata } = this.state;
    storageRef
      .child(`avatars/user/${user.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURl) => {
          this.setState({ uploadedCropeedImage: downloadURl }, () =>
            this.changeAvatar()
          );
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      ?.updateProfile({
        photoURL: this.state.uploadedCropeedImage,
      })
      .then(() => {
        console.log('Photo Updated');
        this.handleCloseModal();
      })
      .catch((err) => {
        console.error(err);
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({
        avatar: this.state.uploadedCropeedImage,
      })
      .then(() => {
        console.log('Updated Avatar Saved To Firebase');
        this.setState({
          blob: new Blob(),
          croppedImage: '',
          previewImage: '',
          uploadedCropeedImage: '',
        });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { modal, previewImage, user, croppedImage } = this.state;
    return (
      <Grid style={{ background: this.props.primaryColor }}>
        <GridColumn>
          <GridRow style={{ padding: '1.2rem', margin: 0 }}>
            {/* App Header */}
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <HeaderContent>DevChat</HeaderContent>
            </Header>
            {/* User Dropdown */}
            <Header inverted style={{ padding: '0.25em' }} as='h4'>
              <Dropdown
                trigger={
                  <span>
                    <Image spaced='right' src={user.photoURL} avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropDownOptions()}
              />
            </Header>
          </GridRow>

          {/* Change User Avatar Modal */}
          <Modal basic open={modal} onClose={this.handleCloseModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleOnFileSelect}
                fluid
                type='file'
                label='New Avatar'
                name='previewImage'
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className='ui center aligned grid'>
                    {/* Image Preview */}
                    {previewImage && (
                      <AvatarEditor
                        ref={(node) => (this.avatarEditor = node)}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {/* Cropped Image Preview */}
                    {croppedImage && (
                      <Image
                        src={croppedImage}
                        width={120}
                        height={120}
                        style={{ margin: '3.5em auto' }}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button
                disabled={croppedImage === ''}
                color='green'
                inverted
                onClick={this.handleImageUploadToFirebase}
              >
                <Icon name='save' /> Change Avatar
              </Button>
              <Button color='orange' inverted onClick={this.handleCropImage}>
                <Icon name='image' /> Preview
              </Button>
              <Button color='red' inverted onClick={this.handleCloseModal}>
                <Icon name='remove' /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </GridColumn>
      </Grid>
    );
  }
}

export default UserPanel;
