import React from 'react';
import { Meta, Story } from '@storybook/react';
import Button, { ButtonProps } from '../src/Button';

const meta: Meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<ButtonProps> = args => <Button {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Primary = Template.bind({});

Primary.args = { type: 'primary', children: 'Button' };

export const PrimaryOutline = Template.bind({});

PrimaryOutline.args = { type: 'primary', outline: true, children: 'Button' };

export const Loading = Template.bind({});

Loading.args = { type: 'primary', loading: true, children: 'Button' };
