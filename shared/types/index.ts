
export interface Beat {
  id: number;
  title: string;
  artist_id: number;
  price: number;
  cover_image_url?: string;
  audio_file_url: string;
  genre?: string;
  bpm?: number;
  duration?: string;
  author?: string;
  tags?: string[];
  likes: number;
}
