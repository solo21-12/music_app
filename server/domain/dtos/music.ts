import { Readable } from "stream";

export interface MusicCreateRequest {
  title: string;
  artist: string;
  album: string;
  genre: string;
  url?: string;
  key?: string;
  file?: Readable;
}

export interface MusicUpdateRequest {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  url?: string;
}

export interface MusicResponse {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  url?: string;
  key?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicGenereResponse {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  count: number;
}

export interface MusicListResponse {
  items: MusicResponse[]; // List of music records
  total: number; // Total number of records, for pagination
}
