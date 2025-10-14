import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Selectbox, type SelectboxOption } from "./index";

const meta: Meta<typeof Selectbox> = {
  title: "Commons/Components/Selectbox",
  component: Selectbox,
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
    options: { control: false },
    value: { control: "text" },
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    onChange: { action: "changed" },
    className: { control: false },
  },
  args: {
    placeholder: "옵션을 선택하세요",
    variant: "primary",
    size: "medium",
    theme: "light",
    disabled: false,
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
      { label: "Durian (disabled)", value: "durian", disabled: true },
      { label: "Eggfruit", value: "eggfruit" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Selectbox>;

export const Playground: Story = {};

export const VariantsLight: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Selectbox {...args} variant="primary" theme="light" />
      <Selectbox {...args} variant="secondary" theme="light" />
      <Selectbox {...args} variant="tertiary" theme="light" />
    </div>
  ),
};

export const VariantsDark: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", background: "#0a0a0a", padding: 12 }}>
      <Selectbox {...args} variant="primary" theme="dark" />
      <Selectbox {...args} variant="secondary" theme="dark" />
      <Selectbox {...args} variant="tertiary" theme="dark" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Selectbox {...args} size="small" />
      <Selectbox {...args} size="medium" />
      <Selectbox {...args} size="large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "비활성화됨",
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "banana",
  },
};

const ControlledExample: React.FC<React.ComponentProps<typeof Selectbox>> = (args) => {
  const [value, setValue] = useState<string | undefined>("apple");
  const options = (args.options as SelectboxOption[]) ?? [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Selectbox
        {...args}
        value={value}
        onChange={(v) => setValue(v)}
      />
      <div style={{ fontSize: 12, color: "#666" }}>
        value: {value || "(empty)"}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.filter(o => !o.disabled).map(o => (
          <button key={o.value} onClick={() => setValue(o.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd" }}>
            set {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};


