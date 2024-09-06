import {
  ErrorResponse,
  MusicCreateRequest,
  MusicResponse,
} from "../../domain/dtos";
import { MusicUsecase } from "../../usecases";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class MusicController {
  constructor(private musicUsecase: MusicUsecase) {}

  async createMusic(req: Request, res: Response) {
    try {
      const music: MusicCreateRequest = req.body;
      const result = await this.musicUsecase.createMusic(music);

      if ((result as ErrorResponse).status) {
        res.status((result as ErrorResponse).status).json({
          message: (result as ErrorResponse).message,
        });
      }

      res.status(StatusCodes.CREATED).json(result as MusicResponse);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }

  async getMusicById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.musicUsecase.findMusicById(id);

      if ((result as ErrorResponse).status) {
        res.status((result as ErrorResponse).status).json({
          message: (result as ErrorResponse).message,
        });
      }

      res.status(StatusCodes.OK).json(result as MusicResponse);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }

  async getMusicList(req: Request, res: Response) {
    try {
      const pageNumber: number = Number(req.query.pageNumber);
      const result = await this.musicUsecase.getMusicList(pageNumber);

      if ((result as ErrorResponse).status) {
        res.status((result as ErrorResponse).status).json({
          message: (result as ErrorResponse).message,
        });
      }

      res.status(StatusCodes.OK).json(result as MusicResponse[]);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }

  async updateMusic(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const music: MusicCreateRequest = req.body;
      const result = await this.musicUsecase.updateMusic(id, music);

      if ((result as ErrorResponse).status) {
        res.status((result as ErrorResponse).status).json({
          message: (result as ErrorResponse).message,
        });
      }

      res.status(StatusCodes.OK).json(result as MusicResponse);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }

  async deleteMusic(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.musicUsecase.deleteMusic(id);

      if ((result as ErrorResponse).status) {
        res.status((result as ErrorResponse).status).json({
          message: (result as ErrorResponse).message,
        });
      }

      res.status(StatusCodes.NO_CONTENT).json();
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }

  async findMusicByField(req: Request, res: Response) {
    try {
      const field = req.params.field;
      const value = req.params.value;
      const result = await this.musicUsecase.findMusicByField(field, value);

      if ((result as ErrorResponse).status) {
        res.status((result as ErrorResponse).status).json({
          message: (result as ErrorResponse).message,
        });
      }

      res.status(StatusCodes.OK).json(result as MusicResponse[]);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred",
      });
    }
  }
}
