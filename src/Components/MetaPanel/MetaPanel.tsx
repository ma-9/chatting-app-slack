import React, { Component } from 'react';
import {
  Segment,
  Header,
  Accordion,
  AccordionTitle,
  Icon,
  AccordionContent,
  Image,
  List,
  ListItem,
  ListContent,
  ListHeader,
  ListDescription,
} from 'semantic-ui-react';

interface IChannelProps {
  createdBy: {
    avatar: string;
    name: string;
  };
  detail: string;
  id: string;
  name: string;
}

interface IComponentProps {
  isPrivateChannel: boolean;
  currentChannel: IChannelProps;
  userPosts: any;
}

class MetaPanel extends Component<IComponentProps> {
  state = {
    channel: this.props.currentChannel,
    isPrivateChannel: this.props.isPrivateChannel,
    activeIndex: 0,
  };

  setActiveIndex = (event: any, titleProps: any) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  formatPost = (num: number) =>
    num > 1 || num === 0 ? `${num} posts` : `${num} post`;

  displayTopPosters = (userPosts: any) => {
    return Object.entries(userPosts)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([key, value]: any, index) => {
        return (
          <ListItem key={index}>
            <Image avatar src={value.avatar} />
            <ListContent>
              <ListHeader as='a'>{key}</ListHeader>
              <ListDescription>{this.formatPost(value.count)}</ListDescription>
            </ListContent>
          </ListItem>
        );
      })
      .slice(0, 5);
  };

  render() {
    const { activeIndex, isPrivateChannel, channel } = this.state;
    const { userPosts } = this.props;
    if (isPrivateChannel) return null;
    return (
      <Segment loading={!channel}>
        <Header as='h3' attached='top'>
          About # {channel ? channel.name : 'Channel Name'}
        </Header>
        <Accordion>
          <AccordionTitle
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='info' />
            Channel Details
          </AccordionTitle>
          <AccordionContent active={activeIndex === 0}>
            {channel && channel.detail}
          </AccordionContent>
        </Accordion>

        <Accordion>
          <AccordionTitle
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='user circle' />
            Top Posters
          </AccordionTitle>
          <AccordionContent active={activeIndex === 1}>
            <List>{userPosts && this.displayTopPosters(userPosts)}</List>
          </AccordionContent>
        </Accordion>

        <Accordion>
          <AccordionTitle
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name='dropdown' />
            <Icon name='pencil alternate' />
            Created by
          </AccordionTitle>
          <AccordionContent active={activeIndex === 2}>
            <Header as='h3'>
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </AccordionContent>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
