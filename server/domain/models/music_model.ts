import mongoose, { Document, model, Model, Schema } from "mongoose";

const MusicSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },

  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

type MusicDocument = Document & {
  _id: mongoose.Types.ObjectId;
  title: string;
  artist: string;
  album: string;
  genre: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

export const MusicModel: Model<MusicDocument> = model<MusicDocument>(
  "Music",
  MusicSchema
);
