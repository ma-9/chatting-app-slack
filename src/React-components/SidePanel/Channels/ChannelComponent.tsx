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
  Label,
} from 'semantic-ui-react';
import { MyFirebase } from 'Config';
import { connect } from 'react-redux';
import {
  setCurrentChannel,
  setPrivateChannel,
} from 'Redux-store/Redux-actions';
import { IChannel, ICurrentUser } from 'Global-interfaces';

interface IProps {
  currentUser: ICurrentUser;
  setCurrentChannel: any;
  setPrivateChannel: any;
}

class ChannelComponent extends Component<IProps> {
  state = {
    user: this.props.currentUser,
    channel: {
      id: '',
      name: '',
      detail: '',
      createdBy: {
        name: '',
        avatar: '',
      },
    },
    channels: [],
    channelName: '',
    channelDetail: '',
    channelRef: MyFirebase.database().ref('channels'),
    messagesRef: MyFirebase.database().ref('messages'),
    typingRef: MyFirebase.database().ref('typing'),
    notifications: [
      {
        id: '',
        total: 0,
        lastKnownTotal: 0,
        count: 0,
      },
    ],
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
    this.state.channelRef.on('child_added', (snap: any) => {
      LoadedChanels.push(snap.val());
      this.setState({ channels: LoadedChanels }, () => this.setFirstChannel());
      this.addNotificationListner(snap.key);
    });
  };

  addNotificationListner = (channelId: string) => {
    this.state.messagesRef.child(channelId).on('value', (snap) => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (
    channelId: string,
    currentChannelId: any,
    notification: any[],
    snap: any
  ) => {
    let lastTotal = 0;

    let index = notification.findIndex(
      (notification) => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notification[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notification[index].count = snap.numChildren() - lastTotal;
        }
      }
      notification[index].lastKnownTotal = snap.numChildren();
    } else {
      notification.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }

    this.setState({ notifications: notification });
  };

  removeListeners = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  handleChangeChannel = (channel: IChannel) => {
    this.setActiveChannel(channel);
    this.state.typingRef
      .child(this.state.channel.id)
      .child(this.state.user.uid)
      .remove();
    this.props.setCurrentChannel(channel);
    this.clearNotifications();
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      (notification: any) => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications: any = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  setActiveChannel = (channel: IChannel) => {
    this.setState({ activeChannelId: channel.id });
  };

  getNotificationCount = (channel: IChannel) => {
    let count = 0;
    this.state.notifications.map((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
      return null;
    });
    if (count > 0) return count;
  };

  displayChannel = (channel: any[]) =>
    channel.length > 0 &&
    channel.map((channel: IChannel, key) => (
      <Menu.Item
        key={key}
        onClick={() => this.handleChangeChannel(channel)}
        style={{ opacity: 0.7 }}
        name={channel.name}
        active={channel.id === this.state.activeChannelId}
      >
        {this.getNotificationCount(channel) && (
          <Label color='red'>{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

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
          {this.displayChannel(this.state.channels)}
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
