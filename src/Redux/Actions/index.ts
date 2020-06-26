// Here we define actions payload and thier type
// Payload means the data what we want to send or store to the redux

import * as actionTypes from './types';

interface IChannelProps {
  currentUser: {
    avatar: string;
    name: string;
  };
  detail: string;
  id: string;
  name: string;
}

export const setUser = (user: any) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER,
  };
};

export const setCurrentChannel = (channel: IChannelProps) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel,
    },
  };
};

export const setPrivateChannel = (value: boolean) => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      privateChannel: value,
    },
  };
};
