import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Modal } from "./index";

const meta: Meta<typeof Modal> = {
  title: "Commons/Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["info", "danger"],
    },
    actions: {
      control: { type: "radio" },
      options: ["single", "dual"],
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
    },
    title: { control: "text" },
    content: { control: "text" },
    singleActionText: { control: "text" },
    dualActionFirstText: { control: "text" },
    dualActionSecondText: { control: "text" },
    onSingleAction: { action: "single action clicked" },
    onDualActionFirst: { action: "dual action first clicked" },
    onDualActionSecond: { action: "dual action second clicked" },
    className: { control: false },
  },
  args: {
    title: "일기 등록 완료",
    content: "등록이 완료 되었습니다.",
    variant: "info",
    actions: "single",
    theme: "light",
    singleActionText: "확인",
    dualActionFirstText: "계속 작성",
    dualActionSecondText: "등록 취소",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--gray-10)",
          padding: "20px",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Playground: Story = {};

// Single Action Stories
export const SingleActionInfoLight: Story = {
  args: {
    title: "일기 등록 완료",
    content: "등록이 완료 되었습니다.",
    variant: "info",
    actions: "single",
    theme: "light",
    singleActionText: "확인",
  },
};

export const SingleActionInfoDark: Story = {
  args: {
    title: "일기 등록 완료",
    content: "등록이 완료 되었습니다.",
    variant: "info",
    actions: "single",
    theme: "dark",
    singleActionText: "확인",
  },
};

export const SingleActionDangerLight: Story = {
  args: {
    title: "일기 삭제 확인",
    content: "정말로 삭제하시겠습니까?",
    variant: "danger",
    actions: "single",
    theme: "light",
    singleActionText: "삭제",
  },
};

export const SingleActionDangerDark: Story = {
  args: {
    title: "일기 삭제 확인",
    content: "정말로 삭제하시겠습니까?",
    variant: "danger",
    actions: "single",
    theme: "dark",
    singleActionText: "삭제",
  },
};

// Dual Action Stories
export const DualActionInfoLight: Story = {
  args: {
    title: "일기 작성 중단",
    content: "작성 중인 내용이 있습니다. 계속 작성하시겠습니까?",
    variant: "info",
    actions: "dual",
    theme: "light",
    dualActionFirstText: "계속 작성",
    dualActionSecondText: "등록 취소",
  },
};

export const DualActionInfoDark: Story = {
  args: {
    title: "일기 작성 중단",
    content: "작성 중인 내용이 있습니다. 계속 작성하시겠습니까?",
    variant: "info",
    actions: "dual",
    theme: "dark",
    dualActionFirstText: "계속 작성",
    dualActionSecondText: "등록 취소",
  },
};

export const DualActionDangerLight: Story = {
  args: {
    title: "일기 삭제 확인",
    content: "삭제된 일기는 복구할 수 없습니다. 정말 삭제하시겠습니까?",
    variant: "danger",
    actions: "dual",
    theme: "light",
    dualActionFirstText: "취소",
    dualActionSecondText: "삭제",
  },
};

export const DualActionDangerDark: Story = {
  args: {
    title: "일기 삭제 확인",
    content: "삭제된 일기는 복구할 수 없습니다. 정말 삭제하시겠습니까?",
    variant: "danger",
    actions: "dual",
    theme: "dark",
    dualActionFirstText: "취소",
    dualActionSecondText: "삭제",
  },
};

// Variant Comparison
export const VariantComparison: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      <Modal
        {...args}
        variant="info"
        title="정보 모달"
        content="정보를 알려드립니다."
        singleActionText="확인"
      />
      <Modal
        {...args}
        variant="danger"
        title="위험 모달"
        content="주의가 필요합니다."
        singleActionText="확인"
      />
    </div>
  ),
  args: {
    actions: "single",
    theme: "light",
  },
};

// Action Type Comparison
export const ActionTypeComparison: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      <Modal
        {...args}
        actions="single"
        title="단일 액션"
        content="하나의 버튼만 있습니다."
        singleActionText="확인"
      />
      <Modal
        {...args}
        actions="dual"
        title="이중 액션"
        content="두 개의 버튼이 있습니다."
        dualActionFirstText="취소"
        dualActionSecondText="확인"
      />
    </div>
  ),
  args: {
    variant: "info",
    theme: "light",
  },
};

// Theme Comparison
export const ThemeComparison: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      <Modal
        {...args}
        theme="light"
        title="라이트 테마"
        content="밝은 테마의 모달입니다."
        singleActionText="확인"
      />
      <Modal
        {...args}
        theme="dark"
        title="다크 테마"
        content="어두운 테마의 모달입니다."
        singleActionText="확인"
      />
    </div>
  ),
  args: {
    variant: "info",
    actions: "single",
  },
};

// Long Content Story
export const LongContent: Story = {
  args: {
    title: "긴 제목이 있는 모달입니다",
    content:
      "이것은 매우 긴 내용을 가진 모달입니다. 여러 줄의 텍스트가 포함되어 있어서 모달의 레이아웃이 어떻게 처리되는지 확인할 수 있습니다.",
    variant: "info",
    actions: "dual",
    theme: "light",
    dualActionFirstText: "취소",
    dualActionSecondText: "확인",
  },
};

// Interactive Example
export const InteractiveExample: Story = {
  args: {
    title: "인터랙티브 모달",
    content: "버튼을 클릭해보세요. Actions 탭에서 이벤트를 확인할 수 있습니다.",
    variant: "info",
    actions: "dual",
    theme: "light",
    dualActionFirstText: "취소",
    dualActionSecondText: "확인",
  },
};
