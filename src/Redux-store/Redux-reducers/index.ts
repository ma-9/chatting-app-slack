import * as actionTypes from 'Redux-store/Redux-actions/types';
import { combineReducers } from 'redux';

const initialState = {
  userState: {
    data: null,
    loading: true,
    error: null,
  },
  channelState: {
    data: null,
    loading: true,
    error: null,
    privateChannel: false,
    userPosts: null,
  },
  colorsState: {
    primaryColor: '#4c3c4c',
    secondaryColor: '#eee',
  },
};

interface IActionProps {
  type: any;
  payload: any;
}

const user_reducer = (state = initialState.userState, action: IActionProps) => {
  const { type } = action;
  switch (type) {
    case actionTypes.SET_USER:
      return {
        data: action.payload.currentUser,
        loading: false,
        error: null,
      };
    case actionTypes.CLEAR_USER:
      return {
        data: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const channel_reducer = (
  state = initialState.channelState,
  action: IActionProps
) => {
  const { type } = action;
  switch (type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        data: action.payload.currentChannel,
        loading: false,
        error: null,
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        privateChannel: action.payload.privateChannel,
      };
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts,
      };
    default:
      return state;
  }
};

const color_reducer = (
  state = initialState.colorsState,
  action: IActionProps
) => {
  switch (action.type) {
    case actionTypes.SET_COLOR:
      return {
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  color: color_reducer,
});

export default rootReducer;
