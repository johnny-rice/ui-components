import React from 'react';
import { Meta, Story } from '@storybook/react';
// @ts-ignore
import { withDesign } from 'storybook-addon-designs';
import { Card, CardProps } from '../src';
import Button from '../src/Button';

const meta: Meta = {
  title: 'Card',
  component: Card,
  decorators: [withDesign],
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/5mMInYH9JdJY389s8iBVQm/Component-Library?node-id=3%3A371',
    },
  },
};

export default meta;

const Template: Story<CardProps> = args => (
  <Card
    title="Title"
    subTitle="Subtext area"
    style={{ width: 400, height: 200 }}
    {...args}
  >
    Content goes here
  </Card>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};

export const WithExtra = Template.bind({});

WithExtra.args = { extra: <Button variant="primary">Create Dashboard</Button> };
