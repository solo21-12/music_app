import mongoose, { model, Model, Schema } from "mongoose";

const UserSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  sessionToken: { type: String, select: false },
});

type UserDocument = Document & {
  email: string;
  name: string;
  password: string;
  sessionToken: string;
};

export const UserModel: Model<UserDocument> = model<UserDocument>(
  "User",
  UserSchema
);
