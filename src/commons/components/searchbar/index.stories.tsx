import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { SearchBar } from "./index";

const meta: Meta<typeof SearchBar> = {
  title: "Commons/Components/SearchBar",
  component: SearchBar,
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
    placeholder: "검색어를 입력해 주세요.",
    variant: "primary",
    size: "medium",
    theme: "light",
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Playground: Story = {};

export const PrimaryLight: Story = {
  args: {
    placeholder: "Primary / Light",
    variant: "primary",
    theme: "light",
  },
};

export const PrimaryDark: Story = {
  render: (args) => (
    <div style={{ background: "#0a0a0a", padding: 12 }}>
      <SearchBar {...args} placeholder="Primary / Dark" variant="primary" theme="dark" />
    </div>
  ),
};

export const SecondaryLight: Story = {
  args: {
    placeholder: "Secondary / Light",
    variant: "secondary",
    theme: "light",
  },
};

export const SecondaryDark: Story = {
  render: (args) => (
    <div style={{ background: "#0a0a0a", padding: 12 }}>
      <SearchBar {...args} placeholder="Secondary / Dark" variant="secondary" theme="dark" />
    </div>
  ),
};

export const TertiaryLight: Story = {
  args: {
    placeholder: "Tertiary / Light",
    variant: "tertiary",
    theme: "light",
  },
};

export const TertiaryDark: Story = {
  render: (args) => (
    <div style={{ background: "#0a0a0a", padding: 12 }}>
      <SearchBar {...args} placeholder="Tertiary / Dark" variant="tertiary" theme="dark" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <SearchBar {...args} size="small" placeholder="Small" />
      <SearchBar {...args} size="medium" placeholder="Medium" />
      <SearchBar {...args} size="large" placeholder="Large" />
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
    const ControlledExample: React.FC = () => {
      const [value, setValue] = useState("");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SearchBar
            {...args}
            value={value}
            onChange={(e) => setValue((e.target as HTMLInputElement).value)}
            placeholder="Controlled search"
          />
          <div style={{ fontSize: 12, color: "#666" }}>value: {value || "(empty)"}</div>
        </div>
      );
    };
    return <ControlledExample />;
  },
};

