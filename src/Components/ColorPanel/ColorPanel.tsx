import React, { Fragment } from 'react';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

const ColorPanel = () => {
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
        <Button icon='add' size='small' color='blue' />
      </Sidebar>
    </Fragment>
  );
};

export default ColorPanel;
