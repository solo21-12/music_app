import {
  ErrorResponse,
  MusicCreateRequest,
  MusicResponse,
} from "../domain/dtos";
import { MusicRepository } from "../repositories";

export class MusicUsecase {
  constructor(private musicRepo: MusicRepository) {}

  async createMusic(
    music: MusicCreateRequest
  ): Promise<MusicResponse | ErrorResponse> {
    return this.musicRepo.create(music);
  }

  async findMusicById(id: string): Promise<MusicResponse | ErrorResponse> {
    return this.musicRepo.findById(id);
  }

  async updateMusic(
    id: string,
    music: MusicCreateRequest
  ): Promise<MusicResponse | ErrorResponse> {
    return this.musicRepo.update(id, music);
  }

  async deleteMusic(id: string): Promise<ErrorResponse | null> {
    return this.musicRepo.delete(id);
  }

  async findAllMusic(
    pageNumber: number
  ): Promise<MusicResponse[] | ErrorResponse> {
    return this.musicRepo.list(pageNumber);
  }

  async findMusicByGenre(
    genre: string
  ): Promise<MusicResponse[] | ErrorResponse> {
    return this.musicRepo.findByGenere(genre);
  }

  async findMusicByArtist(
    artist: string
  ): Promise<MusicResponse[] | ErrorResponse> {
    return this.musicRepo.findByArtist(artist);
  }

  async findMusicByAlbum(
    album: string
  ): Promise<MusicResponse[] | ErrorResponse> {
    return this.musicRepo.findByAlbum(album);
  }
}
