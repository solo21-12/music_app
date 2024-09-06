import { Router } from "express";
import { MusicController } from "../controllers";

export class MusicRouter {
  private router: Router;
  constructor(private musicController: MusicController) {
    this.musicController = musicController;
    this.router = Router();
  }

  public configureRoutes() {
    this.router.post(
      "/music",
      this.musicController.createMusic.bind(this.musicController)
    );
    this.router.get(
      "/music/:id",
      this.musicController.getMusicById.bind(this.musicController)
    );
    this.router.get(
      "/music",
      this.musicController.getMusicList.bind(this.musicController)
    );

    this.router.delete(
      "/music/:id",
      this.musicController.deleteMusic.bind(this.musicController)
    );

    this.router.get(
      "/music/search",
      this.musicController.findMusicByField.bind(this.musicController)
    );

    this.router.patch(
      "/music/:id",
      this.musicController.updateMusic.bind(this.musicController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
