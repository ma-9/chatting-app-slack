import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';

interface IComponentProps {
  uploadState: string;
  percentUploaded: number;
}

class ProgressBar extends Component<IComponentProps> {
  render() {
    const { percentUploaded, uploadState } = this.props;
    return (
      uploadState === 'uploading' && (
        <Progress
          className='progress__bar'
          percent={percentUploaded}
          progress
          indicating
          inverted
          size='medium'
        />
      )
    );
  }
}

export default ProgressBar;
