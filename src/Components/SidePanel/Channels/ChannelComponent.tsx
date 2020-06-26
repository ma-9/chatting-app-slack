import React, { Component, Fragment } from 'react';
import {
  Menu,
  Icon,
  Modal,
  ModalHeader,
  ModalContent,
  Form,
  FormField,
  Input,
  ModalActions,
  Button,
} from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from 'Redux/Actions';

interface IComponentProps {
  currentUser: {
    photoURL: string;
    displayName: string;
  };
  setCurrentChannel: any;
  setPrivateChannel: any;
}

interface IChannelProps {
  currentUser: {
    avatar: string;
    name: string;
  };
  detail: string;
  id: string;
  name: string;
}

class ChannelComponent extends Component<IComponentProps> {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetail: '',
    channelRef: MyFirebase.database().ref('channels'),
    isModalOpen: false,
    firstLoad: true,
    activeChannelId: '',
  };

  handleModalOpen = () => {
    this.setState({ isModalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  handleOnChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleOnSubmit = (event: any) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      const channelRef = this.state.channelRef;
      const key: any = channelRef.push().key;
      channelRef
        .child(key)
        .update({
          id: key,
          name: this.state.channelName,
          detail: this.state.channelDetail,
          createdBy: {
            name: this.state.user.displayName,
            avatar: this.state.user.photoURL,
          },
        })
        .then(() => {
          this.setState({
            channelName: '',
            channelDetail: '',
            isModalOpen: false,
          });
          console.log('Channel Added');
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  isFormValid = ({ channelName, channelDetail }: any) =>
    channelName && channelDetail;

  addListners = () => {
    let LoadedChanels: any = [];
    this.state.channelRef.on('child_added', (snap) => {
      LoadedChanels.push(snap.val());
      this.setState({ channels: LoadedChanels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  handleChangeChannel = (channel: IChannelProps) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  setActiveChannel = (channel: IChannelProps) => {
    this.setState({ activeChannelId: channel.id });
  };

  componentDidMount() {
    this.addListners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    return (
      <Fragment>
        <Menu.Menu className='menu'>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span>{' '}
            ({this.state.channels.length}){' '}
            <Icon
              name='add'
              onClick={this.handleModalOpen}
              style={{ cursor: 'pointer' }}
            />
          </Menu.Item>
          {this.state.channels.length > 0 &&
            this.state.channels.map((channel: IChannelProps, key) => (
              <Menu.Item
                key={key}
                onClick={() => this.handleChangeChannel(channel)}
                style={{ opacity: 0.7 }}
                name={channel.name}
                active={channel.id === this.state.activeChannelId}
              >
                # {channel.name}
              </Menu.Item>
            ))}
        </Menu.Menu>

        {/* Add New Channel */}
        <Modal
          basic
          open={this.state.isModalOpen}
          onClose={this.handleModalClose}
        >
          <ModalHeader>Add a Channel</ModalHeader>
          <ModalContent>
            <Form onSubmit={this.handleOnSubmit}>
              <FormField>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  value={this.state.channelName}
                  onChange={this.handleOnChange}
                />
              </FormField>
              <FormField>
                <Input
                  fluid
                  label='Description of Channel'
                  name='channelDetail'
                  value={this.state.channelDetail}
                  onChange={this.handleOnChange}
                />
              </FormField>
            </Form>
          </ModalContent>

          <ModalActions>
            <Button color='green' inverted onClick={this.handleOnSubmit}>
              <Icon name='checkmark' /> Add
            </Button>
            <Button color='red' inverted onClick={this.handleModalClose}>
              <Icon name='remove' /> Cancel
            </Button>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  ChannelComponent
);
