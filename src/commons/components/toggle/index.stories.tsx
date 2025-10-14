import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Toggle } from "./index";

const meta: Meta<typeof Toggle> = {
  title: "Commons/Components/Toggle",
  component: Toggle,
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
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    onChange: { action: "changed" },
    className: { control: false },
  },
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    disabled: false,
    label: "알림 설정",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Playground: Story = {};

export const VariantsLight: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Toggle {...args} variant="primary" theme="light" />
      <Toggle {...args} variant="secondary" theme="light" />
      <Toggle {...args} variant="tertiary" theme="light" />
    </div>
  ),
};

export const VariantsDark: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
        background: "#0a0a0a",
        padding: 12,
      }}
    >
      <Toggle {...args} variant="primary" theme="dark" />
      <Toggle {...args} variant="secondary" theme="dark" />
      <Toggle {...args} variant="tertiary" theme="dark" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Toggle {...args} size="small" />
      <Toggle {...args} size="medium" />
      <Toggle {...args} size="large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "비활성화됨",
  },
};

export const WithDefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const ControlledExample: React.FC = () => {
      const [isOn, setIsOn] = useState<boolean>(args.checked ?? true);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Toggle
            {...args}
            checked={isOn}
            onChange={(next) => setIsOn(next)}
            label={args.label ?? "제어 토글"}
          />
          <div style={{ fontSize: 12, color: "#666" }}>
            checked: {String(isOn)}
          </div>
        </div>
      );
    };
    return <ControlledExample />;
  },
};
