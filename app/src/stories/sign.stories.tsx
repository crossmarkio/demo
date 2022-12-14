import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sign from '../screens/Sign/index';
import * as XummStories from "./xumm.stories";

//π This default export determines where your story goes in the story list
export default {
  /* π The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Sign',
  component: Sign,
} as ComponentMeta<typeof Sign>;

//π We create a βtemplateβ of how args map to rendering
const Template: ComponentStory<typeof Sign> = (args:any) => <Sign {...args}Β >Button</Sign>;

export const Default = Template.bind({});

Default.args = {
  /*π The args you need here will depend on your component */
  request:{"TransactionType":"SignIn"},
  ...XummStories.Default.args,
};
