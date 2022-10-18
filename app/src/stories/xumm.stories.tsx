import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Xumm from '../components/Xumm/index';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'XUMM',
  component: Xumm,
} as ComponentMeta<typeof Xumm>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Xumm> = (args:any) => <Xumm {...args} ></Xumm>;

export const Default = Template.bind({});

Default.args = {
  /*👇 The args you need here will depend on your component */
  size: 200, 
  xumm_api_key: 'e0b87014-e090-4d33-994a-2a7fab723e07', 
  baseUrl: 'http://localhost:4001', 
  route: '', 
  header: true, 
  setState: () => {},
  request:{"TransactionType":"SignIn"},
};
