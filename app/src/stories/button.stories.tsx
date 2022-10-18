import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import ButtonComponent from '../components/Button/index';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  component: ButtonComponent,
} as ComponentMeta<typeof ButtonComponent>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof ButtonComponent> = (args) => <ButtonComponent {...args} >Button</ButtonComponent>;

export const Primary = Template.bind({});

Primary.args = {
  /*👇 The args you need here will depend on your component */
  type:"primary",
  color:'white',
  theme:"light",
  onClick:() => {console.log('clicked')},
  width:'50%',
  height:'45px'
};

export const Secondary = Template.bind({});

Secondary.args = {
  /*👇 The args you need here will depend on your component */
  type:"secondary",
  color:'white',
  theme:"light",
  onClick:() => {console.log('clicked')},
  width:'50%',
  height:'45px'
};

export const Menu = Template.bind({});

Menu.args = {
  /*👇 The args you need here will depend on your component */
  type:"menu",
  color:'white',
  theme:"light",
  onClick:() => {console.log('clicked')},
  width:'50%',
  height:'45px'
};