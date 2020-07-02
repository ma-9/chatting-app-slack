import React from 'react';

interface IHookProps {
  setStateFunc: () => {};
  callBackFunc: () => {};
}

const setStateWithCallback: React.FC<IHookProps> = (props) => {
  const { callBackFunc, setStateFunc } = props;
  console.log(callBackFunc, setStateFunc);
  return null;
};

export default setStateWithCallback;
