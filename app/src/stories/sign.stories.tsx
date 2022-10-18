import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sign from '../screens/Sign/index';
import * as XummStories from "./xumm.stories";

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Sign',
  component: Sign,
} as ComponentMeta<typeof Sign>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Sign> = (args:any) => <Sign {...args} >Button</Sign>;

export const Default = Template.bind({});

Default.args = {
  /*👇 The args you need here will depend on your component */
  request:{"TransactionType":"SignIn"},
  ...XummStories.Default.args,
};
