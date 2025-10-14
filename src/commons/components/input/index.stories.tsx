import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Input } from "./index";

const meta: Meta<typeof Input> = {
  title: "Commons/Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
    },
    type: {
      control: { type: "radio" },
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    placeholder: { control: "text" },
    value: { control: "text" },
    onChange: { action: "changed" },
    onFocus: { action: "focused" },
    onBlur: { action: "blurred" },
    className: { control: false },
  },
  args: {
    placeholder: "텍스트를 입력해주세요",
    variant: "primary",
    size: "medium",
    theme: "light",
    disabled: false,
    error: false,
    type: "text",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const PrimaryLight: Story = {
  args: {
    placeholder: "Primary / Light",
    variant: "primary",
    theme: "light",
  },
};

export const PrimaryDark: Story = {
  args: {
    placeholder: "Primary / Dark",
    variant: "primary",
    theme: "dark",
  },
};

export const SecondaryLight: Story = {
  args: {
    placeholder: "Secondary / Light",
    variant: "secondary",
    theme: "light",
  },
};

export const SecondaryDark: Story = {
  args: {
    placeholder: "Secondary / Dark",
    variant: "secondary",
    theme: "dark",
  },
};

export const TertiaryLight: Story = {
  args: {
    placeholder: "Tertiary / Light",
    variant: "tertiary",
    theme: "light",
  },
};

export const TertiaryDark: Story = {
  args: {
    placeholder: "Tertiary / Dark",
    variant: "tertiary",
    theme: "dark",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Input {...args} size="small" placeholder="Small" />
      <Input {...args} size="medium" placeholder="Medium" />
      <Input {...args} size="large" placeholder="Large" />
    </div>
  ),
  args: {
    variant: "primary",
    theme: "light",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled",
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    placeholder: "Error",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled input"
        />
        <div style={{ fontSize: 12, color: "#666" }}>
          value: {value || "(empty)"}
        </div>
      </div>
    );
  },
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Input {...args} type="text" placeholder="text" />
      <Input {...args} type="email" placeholder="email" />
      <Input {...args} type="password" placeholder="password" />
      <Input {...args} type="number" placeholder="number" />
      <Input {...args} type="tel" placeholder="tel" />
      <Input {...args} type="url" placeholder="url" />
      <Input {...args} type="search" placeholder="search" />
    </div>
  ),
};
