import youtubedl, { downloadOptions } from "ytdl-core";
import { Readable } from "stream";

export class YoutubeVideoService {
  async getVideoInfo(videoId: string) {
    return youtubedl.getInfo(videoId);
  }

  async downloadVideo(videoId: string): Promise<Readable> {
    const options: downloadOptions = {
      filter: "audioonly",
      quality: "highestaudio",
    };
    const video = youtubedl(videoId, options);
    return video;
  }
}
