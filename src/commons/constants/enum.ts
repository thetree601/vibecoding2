import { red, blue, gray, yellow, green } from "./color";

export enum Emotion {
  Happy = "Happy",
  Sad = "Sad",
  Angry = "Angry",
  Surprise = "Surprise",
  Etc = "Etc",
}

export type EmotionKey = keyof typeof Emotion;

export type EmotionAsset = {
  label: string;
  icon: {
    m: string;
    s: string;
  };
  color: string;
};

export const EMOTION_ASSETS: Record<Emotion, EmotionAsset> = {
  [Emotion.Happy]: {
    label: "행복해요",
    icon: {
      m: "/images/emotion-happy-m.png",
      s: "/images/emotion-happy-s.png",
    },
    color: red["60"],
  },
  [Emotion.Sad]: {
    label: "슬퍼요",
    icon: {
      m: "/images/emotion-sad-m.png",
      s: "/images/emotion-sad-s.png",
    },
    color: blue["60"],
  },
  [Emotion.Angry]: {
    label: "화나요",
    icon: {
      m: "/images/emotion-angry-m.png",
      s: "/images/emotion-angry-s.png",
    },
    color: gray["60"],
  },
  [Emotion.Surprise]: {
    label: "놀랐어요",
    icon: {
      m: "/images/emotion-surprise-m.png",
      s: "/images/emotion-surprise-s.png",
    },
    color: yellow["60"],
  },
  [Emotion.Etc]: {
    label: "기타",
    icon: {
      m: "/images/emotion-etc-m.png",
      s: "/images/emotion-etc-s.png",
    },
    color: green["60"],
  },
};

export const EMOTIONS: Emotion[] = [
  Emotion.Happy,
  Emotion.Sad,
  Emotion.Angry,
  Emotion.Surprise,
  Emotion.Etc,
];

// 접근 권한 레벨
export enum AccessLevel {
  Anyone = "anyone",
  Member = "member",
}

export type AccessLevelKey = keyof typeof AccessLevel;

export default Emotion;
