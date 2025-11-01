export interface Image {
  url: string;
  type: 'potrait' | 'landscape';
  title: string;
}

export type FilterType = 'all' | 'potrait' | 'landscape';

export interface GuestMessage {
  name: string;
  message: string;
}






