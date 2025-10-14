import { red, blue, gray, yellow, green } from './color';

export enum Emotion {
  Happy = 'Happy',
  Sad = 'Sad',
  Angry = 'Angry',
  Surprise = 'Surprise',
  Etc = 'Etc',
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
    label: '행복해요',
    icon: {
      m: '/icons/emotion-happy-m.svg',
      s: '/icons/emotion-happy-s.svg',
    },
    color: red['60'],
  },
  [Emotion.Sad]: {
    label: '슬퍼요',
    icon: {
      m: '/icons/emotion-sad-m.svg',
      s: '/icons/emotion-sad-s.svg',
    },
    color: blue['60'],
  },
  [Emotion.Angry]: {
    label: '화나요',
    icon: {
      m: '/icons/emotion-angry-m.svg',
      s: '/icons/emotion-angry-s.svg',
    },
    color: gray['60'],
  },
  [Emotion.Surprise]: {
    label: '놀랐어요',
    icon: {
      m: '/icons/emotion-surprise-m.svg',
      s: '/icons/emotion-surprise-s.svg',
    },
    color: yellow['60'],
  },
  [Emotion.Etc]: {
    label: '기타',
    icon: {
      m: '/icons/emotion-etc-m.svg',
      s: '/icons/emotion-etc-s.svg',
    },
    color: green['60'],
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
  Anyone = 'anyone',
  Member = 'member',
}

export type AccessLevelKey = keyof typeof AccessLevel;

export default Emotion;


