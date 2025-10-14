import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { Pagination } from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Commons/Components/Pagination",
  component: Pagination,
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
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    showArrows: { control: "boolean" },
    showEdgeButtons: { control: "boolean" },
    maxVisible: { control: { type: "number", min: 3, step: 1 } },
    onChange: { action: "changed" },
    className: { control: false },
  },
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: "primary",
    size: "medium",
    theme: "light",
    showArrows: true,
    showEdgeButtons: false,
    maxVisible: 7,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Playground: Story = {};

export const VariantsLight: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Pagination {...args} variant="primary" theme="light" />
      <Pagination {...args} variant="secondary" theme="light" />
      <Pagination {...args} variant="tertiary" theme="light" />
    </div>
  ),
};

export const VariantsDark: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", background: "#0a0a0a", padding: 12 }}>
      <Pagination {...args} variant="primary" theme="dark" />
      <Pagination {...args} variant="secondary" theme="dark" />
      <Pagination {...args} variant="tertiary" theme="dark" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Pagination {...args} size="small" />
      <Pagination {...args} size="medium" />
      <Pagination {...args} size="large" />
    </div>
  ),
};

export const WithArrowsAndEdges: Story = {
  args: {
    showArrows: true,
    showEdgeButtons: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage ?? 1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Pagination
          {...args}
          currentPage={page}
          onChange={(p) => setPage(p)}
        />
        <div style={{ fontSize: 12, color: "#666" }}>currentPage: {page}</div>
      </div>
    );
  },
};

export const DenseMaxVisible: Story = {
  args: {
    totalPages: 50,
    currentPage: 25,
    maxVisible: 5,
  },
};


