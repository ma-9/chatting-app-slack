import * as actionTypes from 'Redux/Actions/types';
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
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
});

export default rootReducer;
