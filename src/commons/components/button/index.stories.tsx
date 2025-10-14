import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Commons/Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    disabled: { control: 'boolean' },
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
    onClick: { action: 'clicked' },
    className: { control: false },
    children: { control: 'text' },
  },
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    type: 'button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const PrimaryLight: Story = {
  args: {
    children: 'Primary / Light',
    variant: 'primary',
    theme: 'light',
  },
};

export const PrimaryDark: Story = {
  args: {
    children: 'Primary / Dark',
    variant: 'primary',
    theme: 'dark',
  },
};

export const SecondaryLight: Story = {
  args: {
    children: 'Secondary / Light',
    variant: 'secondary',
    theme: 'light',
  },
};

export const SecondaryDark: Story = {
  args: {
    children: 'Secondary / Dark',
    variant: 'secondary',
    theme: 'dark',
  },
};

export const TertiaryLight: Story = {
  args: {
    children: 'Tertiary / Light',
    variant: 'tertiary',
    theme: 'light',
  },
};

export const TertiaryDark: Story = {
  args: {
    children: 'Tertiary / Dark',
    variant: 'tertiary',
    theme: 'dark',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="small">Small</Button>
      <Button {...args} size="medium">Medium</Button>
      <Button {...args} size="large">Large</Button>
    </div>
  ),
  args: {
    variant: 'primary',
    theme: 'light',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};


