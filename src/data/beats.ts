interface Beat {
  id: number;
  title: string;
  genre: string;
  bpm: number;
  duration: string;
  audioSrc: string;
  imageSrc?: string;
  author: string;
  price?: string;
  tags?: string[];
  likes: number;
}

import audioFile from '@/assets/6trece/TRECE.mp3';
import imageFile from '@/assets/6trece/SIXTRECEEE.png';

export const beats: Beat[] = [
  {
    id: 1,
    title: "TRECE",
    genre: "Trap",
    bpm: 130,
    duration: "3:00",
    audioSrc: audioFile,
    imageSrc: imageFile,
    author: "JYLSTHEPRODUCER",
    price: "Écoute seule",
    tags: ["Sombre", "Lourd", "Atmosphérique", "63OG"],
    likes: 0
  },
  // Ajoutez d'autres prods ici
];
