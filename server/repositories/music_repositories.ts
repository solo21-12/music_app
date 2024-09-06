import {
  ErrorResponse,
  MusicCreateRequest,
  MusicResponse,
} from "../domain/dtos";
import {
  InternalServerError,
  NotFoundError,
} from "../domain/dtos/error_response";
import { MusicGenereResponse } from "../domain/dtos/music";
import { MusicModel } from "../domain/models";

export class MusicRepository {
  async create(
    music: MusicCreateRequest
  ): Promise<MusicResponse | ErrorResponse> {
    try {
      const newMusic = new MusicModel(music);
      const savedMusic = await newMusic.save();

      const result: MusicResponse = {
        id: savedMusic._id.toString(),
        title: savedMusic.title,
        artist: savedMusic.artist,
        album: savedMusic.album,
        genre: savedMusic.genre,
        url: savedMusic.url,
        createdAt: savedMusic.createdAt,
        updatedAt: savedMusic.updatedAt,
      };

      return result;
    } catch (error) {
      console.error("Error creating music:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async findById(id: string): Promise<MusicResponse | ErrorResponse> {
    try {
      const music = await MusicModel.findById(id);
      if (!music) {
        return NotFoundError("Music not found");
      }

      const result: MusicResponse = {
        id: music._id.toString(),
        title: music.title,
        artist: music.artist,
        album: music.album,
        genre: music.genre,
        url: music.url,
        createdAt: music.createdAt,
        updatedAt: music.updatedAt,
      };

      return result;
    } catch (error) {
      console.error("Error finding music by ID:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async list(pageNumber: number): Promise<MusicResponse[] | ErrorResponse> {
    try {
      const music = await MusicModel.find()
        .skip((pageNumber - 1) * 10)
        .limit(10);

      return music.map((m) => ({
        id: m._id.toString(),
        title: m.title,
        artist: m.artist,
        album: m.album,
        genre: m.genre,
        url: m.url,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }));
    } catch (error) {
      console.error("Error listing music:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async update(
    id: string,
    music: MusicCreateRequest
  ): Promise<MusicResponse | ErrorResponse> {
    try {
      const updatedMusic = await MusicModel.findByIdAndUpdate(id, music, {
        new: true,
      });

      if (!updatedMusic) {
        return NotFoundError("Music not found");
      }

      const result: MusicResponse = {
        id: updatedMusic._id.toString(),
        title: updatedMusic.title,
        artist: updatedMusic.artist,
        album: updatedMusic.album,
        genre: updatedMusic.genre,
        url: updatedMusic.url,
        createdAt: updatedMusic.createdAt,
        updatedAt: updatedMusic.updatedAt,
      };

      return result;
    } catch (error) {
      console.error("Error updating music:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async delete(id: string): Promise<ErrorResponse | null> {
    try {
      const res = await MusicModel.findByIdAndDelete(id);

      if (!res) {
        return NotFoundError("Music not found");
      }

      return null;
    } catch (error) {
      console.error("Error deleting music:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async findByGenere(
    genre: string
  ): Promise<MusicGenereResponse[] | ErrorResponse> {
    try {
      const music = await MusicModel.find({ genre });

      return music.map((m) => ({
        id: m._id.toString(),
        title: m.title,
        artist: m.artist,
        album: m.album,
        genre: m.genre,
        url: m.url,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        count: music.length,
      }));
    } catch (error) {
      console.error("Error finding music by genre:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async findByArtist(
    artist: string
  ): Promise<MusicGenereResponse[] | ErrorResponse> {
    try {
      const music = await MusicModel.find({ artist });

      return music.map((m) => ({
        id: m._id.toString(),
        title: m.title,
        artist: m.artist,
        album: m.album,
        genre: m.genre,
        url: m.url,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        count: music.length,
      }));
    } catch (error) {
      console.error("Error finding music by artist:", error);
      return InternalServerError("Internal Server Error");
    }
  }

  async findByAlbum(
    album: string
  ): Promise<MusicGenereResponse[] | ErrorResponse> {
    try {
      const music = await MusicModel.find({ album });

      return music.map((m) => ({
        id: m._id.toString(),
        title: m.title,
        artist: m.artist,
        album: m.album,
        genre: m.genre,
        url: m.url,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        count: music.length,
      }));
    } catch (error) {
      console.error("Error finding music by album:", error);
      return InternalServerError("Internal Server Error");
    }
  }
}
