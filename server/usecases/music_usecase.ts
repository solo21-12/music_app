import {
  ErrorResponse,
  MusicCreateRequest,
  MusicResponse,
} from "../domain/dtos";
import { InternalServerError } from "../domain/dtos/error_response";
import { UploadService, YoutubeVideoService } from "../infrastructure";
import { MusicRepository } from "../repositories";

export class MusicUsecase {
  constructor(
    private musicRepo: MusicRepository,
    private uploadService: UploadService,
    private ytService: YoutubeVideoService
  ) {}

  // Unified logic for file upload (either from YouTube or file input)
  private async processMusicUpload(
    music: MusicCreateRequest
  ): Promise<MusicCreateRequest | ErrorResponse> {
    const key = `music/${music.title}.mp3`;
    let fileBuffer: Buffer;

    if (music.url) {
      const videoStream = await this.ytService.downloadVideo(music.url);
      fileBuffer = await this.uploadService.streamToBuffer(videoStream);
    } else if (music.file) {
      fileBuffer = await this.uploadService.streamToBuffer(music.file);
    } else {
      return music; // No upload required
    }

    const uploadResponse = await this.uploadService.uploadFile(key, fileBuffer);
    if (uploadResponse) {
      return uploadResponse;
    }

    music.key = key;
    return music;
  }

  // Generate presigned URL for a music object
  private async setPresignedUrlForMusic(
    music: MusicResponse
  ): Promise<string | ErrorResponse> {
    if (music.key) {
      return await this.uploadService.getFileUrl(music.key);
    }
    return "";
  }

  // Set presigned URLs for a list of music objects
  private async setPresignedUrls(
    musicList: MusicResponse[]
  ): Promise<MusicResponse[] | ErrorResponse> {
    try {
      for (let music of musicList) {
        const url = await this.setPresignedUrlForMusic(music);
        if ((url as ErrorResponse).status) {
          return url as ErrorResponse;
        }
        music.url = url as string;
      }
      return musicList;
    } catch (error) {
      console.error(`Error setting presigned URLs: ${error}`);
      return InternalServerError("Error setting URLs");
    }
  }

  // Main createMusic logic
  async createMusic(
    music: MusicCreateRequest
  ): Promise<MusicResponse | ErrorResponse> {
    try {
      const processedMusic = await this.processMusicUpload(music);
      if ((processedMusic as ErrorResponse).status) {
        return processedMusic as ErrorResponse;
      }

      return this.musicRepo.create(music);
    } catch (error) {
      console.error(`Error creating music: ${error}`);
      return InternalServerError("Error creating music");
    }
  }

  // Get music by ID and set its URL
  async findMusicById(id: string): Promise<MusicResponse | ErrorResponse> {
    try {
      const music = await this.musicRepo.findById(id);
      if ((music as ErrorResponse).status) {
        return music;
      }

      const url = await this.setPresignedUrlForMusic(music as MusicResponse);
      if ((url as ErrorResponse).status) {
        return url as ErrorResponse;
      }

      (music as MusicResponse).url = url as string;
      return music;
    } catch (error) {
      console.error(`Error finding music by ID: ${error}`);
      return InternalServerError("Error finding music");
    }
  }

  // Update existing music
  async updateMusic(
    id: string,
    music: MusicCreateRequest
  ): Promise<MusicResponse | ErrorResponse> {
    try {
      const existingMusic = await this.musicRepo.findById(id);
      if ((existingMusic as ErrorResponse).status) {
        return existingMusic as ErrorResponse;
      }

      // Delete old file if new one is uploaded
      if (music.url || music.file) {
        const oldKey = (existingMusic as MusicResponse).key;
        if (oldKey) {
          const deleteResponse = await this.uploadService.deleteFile(oldKey);
          if (deleteResponse) return deleteResponse;
        }

        const processedMusic = await this.processMusicUpload(music);
        if ((processedMusic as ErrorResponse).status) {
          return processedMusic as ErrorResponse;
        }

        music.key = (processedMusic as MusicCreateRequest).key;
      }

      return this.musicRepo.update(id, music);
    } catch (error) {
      return InternalServerError("Error updating music");
    }
  }

  // Delete music by ID
  async deleteMusic(id: string): Promise<ErrorResponse | null> {
    try {
      const music = await this.musicRepo.findById(id);
      if ((music as ErrorResponse).status) {
        return music as ErrorResponse;
      }

      const key = (music as MusicResponse).key;
      if (key) {
        const deleteResponse = await this.uploadService.deleteFile(key);
        if (deleteResponse) return deleteResponse;
      }

      return this.musicRepo.delete(id);
    } catch (error) {
      console.error(`Error deleting music: ${error}`);
      return InternalServerError("Error deleting music");
    }
  }

  // Retrieve all music with presigned URLs
  async getMusicList(
    pageNumber: number
  ): Promise<MusicResponse[] | ErrorResponse> {
    try {
      const musicList = await this.musicRepo.list(pageNumber);
      if ((musicList as ErrorResponse).status) {
        return musicList as ErrorResponse;
      }

      return this.setPresignedUrls(musicList as MusicResponse[]);
    } catch (error) {
      console.error(`Error retrieving all music: ${error}`);
      return InternalServerError("Error retrieving music");
    }
  }

  async findMusicByField(
    field: string,
    value: string
  ): Promise<MusicResponse[] | ErrorResponse> {
    try {
      const musicList = await this.musicRepo.findByField(field, value);
      if ((musicList as ErrorResponse).status) {
        return musicList as ErrorResponse;
      }

      return this.setPresignedUrls(musicList as MusicResponse[]);
    } catch (error) {
      console.error(`Error finding music by ${field}: ${error}`);
      return InternalServerError(`Error finding music by ${field}`);
    }
  }
}
