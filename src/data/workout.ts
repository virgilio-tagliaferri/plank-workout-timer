export type Exercise = {
  id: number;
  name: string;
  duration: number; // seconds
  image?: string;
  canMirror?: boolean;
};

export const WORKOUT: Exercise[] = [
  {
    id: 1,
    name: 'Simple Elbow Plank',
    duration: 45,
    image: '/exercises/elbow-plank.png',
  },
  {
    id: 2,
    name: 'Slow Mountain Climber',
    duration: 45,
    image: '/exercises/mountain-climber.png',
  },
  {
    id: 3,
    name: 'Plank to Dolphin',
    duration: 45,
    image: '/exercises/plank-dolphin.png',
  },
  {
    id: 4,
    name: 'Single Leg Plank',
    duration: 45,
    image: '/exercises/single-leg-plank.png',
    canMirror: true,
  },
  {
    id: 5,
    name: 'Plank Hip Dip',
    duration: 45,
    image: '/exercises/hip-dip.png',
  },
  {
    id: 6,
    name: 'Side Plank',
    duration: 45,
    image: '/exercises/side-plank.png',
    canMirror: true,
  },
  {
    id: 7,
    name: 'Spiderman Plank',
    duration: 45,
    image: '/exercises/spiderman-plank.png',
  },
  {
    id: 8,
    name: 'Single Arm Plank',
    duration: 45,
    image: '/exercises/single-arm-plank.png',
    canMirror: true,
  },
  {
    id: 9,
    name: 'Commando Plank',
    duration: 45,
    image: '/exercises/commando-plank.png',
  },
  {
    id: 10,
    name: 'Plank Jacks',
    duration: 45,
    image: '/exercises/plank-jacks.png',
  },
];
