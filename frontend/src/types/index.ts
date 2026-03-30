export interface Session {
  id: string;
  room_code: string;
  city_vibe: string;
  user_count: number;
  created_at: string;
}

export interface Photo {
  id: string;
  session_id: string;
  image_url: string;
  position: number;
  created_at: string;
}

export interface Design {
  template: string;
  fontStyle: string;
  filter: string;
  stickers: string[];
  captions: string[];
}

export interface CityVibe {
  id: string;
  name: string;
  color: string;
  background: string;
  filter: string;
  icon: string;
}

export interface PhotoStrip {
  id: string;
  photos: string[];
  design: Design;
  cityVibe: CityVibe;
  createdAt: Date;
}