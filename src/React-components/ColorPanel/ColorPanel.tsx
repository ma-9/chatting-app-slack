import React, { Fragment, Component } from 'react';
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment,
} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import { MyFirebase } from 'Config';
import { connect } from 'react-redux';
import { setColors } from 'Redux-store/Redux-actions';

interface IProps {
  currentUser: any;
  setColors: any;
}

class ColorPanel extends Component<IProps> {
  state = {
    modal: false,
    primaryColor: '',
    secondaryColor: '',
    user: this.props.currentUser,
    userRef: MyFirebase.database().ref('users'),
    userColors: [],
  };

  handleOnPrimaryColorChange = (color: any) => {
    this.setState({ primaryColor: color.hex });
  };

  handleOnSecondaryColorChange = (color: any) => {
    this.setState({ secondaryColor: color.hex });
  };

  handleOpenModal = () => {
    this.setState({ modal: true });
  };

  handleCloseModal = () => {
    this.setState({ modal: false });
  };

  handleOnSaveButtonPressed = () => {
    if (this.state.primaryColor && this.state.secondaryColor) {
      this.saveColorToDatabase(
        this.state.primaryColor,
        this.state.secondaryColor
      );
    }
  };

  saveColorToDatabase = (primaryColor: string, secondaryColor: string) => {
    this.state.userRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primaryColor,
        secondaryColor,
      })
      .then(() => {
        console.log('Colours Added');
        this.handleCloseModal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  displayUserColor = (colors: any[]) => {
    return (
      colors.length > 0 &&
      colors.map((colors, index) => {
        return (
          <Fragment key={index}>
            <Divider />
            <div
              className='color__container'
              onClick={() =>
                this.props.setColors(colors.primaryColor, colors.secondaryColor)
              }
            >
              <div
                className='color__sqaure'
                style={{ backgroundColor: colors.primaryColor }}
              >
                <div
                  className='color__overlay'
                  style={{ backgroundColor: colors.secondaryColor }}
                ></div>
              </div>
            </div>
          </Fragment>
        );
      })
    );
  };

  addListener = (userId: string) => {
    let userColors: any[] = [];
    this.state.userRef.child(`${userId}/colors`).on('child_added', (snap) => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    });
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = () => {
    this.state.userRef.child(`${this.state.user.uid}/colors`).off();
  };

  render() {
    const { modal, primaryColor, secondaryColor, userColors } = this.state;
    return (
      <Fragment>
        <Sidebar
          as={Menu}
          icon='labeled'
          inverted
          vertical
          visible
          width='very thin'
        >
          <Divider />
          <Button
            icon='add'
            size='small'
            color='blue'
            onClick={this.handleOpenModal}
          />

          {this.displayUserColor(userColors)}

          {/* Color Picker Modal */}
          <Modal basic open={modal} onClose={this.handleCloseModal}>
            <Modal.Header>Choose App Colour</Modal.Header>
            <Modal.Content>
              <Segment inverted>
                <Label content='Primary Color' />
                <SliderPicker
                  color={primaryColor}
                  onChange={this.handleOnPrimaryColorChange}
                />
              </Segment>
              <Segment inverted>
                <Label content='Secondary Color' />
                <SliderPicker
                  color={secondaryColor}
                  onChange={this.handleOnSecondaryColorChange}
                />
              </Segment>
            </Modal.Content>
            <Modal.Actions>
              <Button
                color='green'
                inverted
                onClick={this.handleOnSaveButtonPressed}
              >
                <Icon name='checkmark' /> Save Colors
              </Button>
              <Button color='red' inverted onClick={this.handleCloseModal}>
                <Icon name='remove' /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Sidebar>
      </Fragment>
    );
  }
}
export default connect(null, { setColors })(ColorPanel);
