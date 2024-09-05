import {
  UserCreateRequest,
  UpdateUserRequest,
  UserResponse,
  NotFoundError,
  ErrorResponse,
  UserAuth,
} from "../domain/dtos";
import { UserModel } from "../domain/models";

export class UserRepository {
  async create(user: UserCreateRequest): Promise<UserResponse> {
    try {
      const newUser = new UserModel(user);
      const savedUser = await newUser.save();

      return {
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Internal Server Error");
    }
  }

  async findById(id: string): Promise<UserResponse | ErrorResponse> {
    try {
      const user = await UserModel.findById(id);

      if (!user) {
        return NotFoundError("User not found");
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Internal Server Error");
    }
  }

  async findByEmail(email: string): Promise<UserAuth | ErrorResponse> {
    try {
      const user = await UserModel.findOne({ email }).select(
        "name email password"
      );

      if (!user) {
        return NotFoundError("User not found");
      }

      return {
        password: user.password,
        email: user.email,
        accessToken: user.accessToken,
      };
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Internal Server Error");
    }
  }

  async delete(id: string): Promise<ErrorResponse | null> {
    try {
      const res = await UserModel.findByIdAndDelete(id);

      if (!res) {
        return NotFoundError("User not found");
      }

      return null;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Internal Server Error");
    }
  }

  async update(
    id: string,
    updateRequest: UpdateUserRequest
  ): Promise<UserResponse | ErrorResponse> {
    try {
      const userExists = await UserModel.findById(id);

      if (!userExists) {
        return NotFoundError("User not found");
      }

      if (updateRequest.email) {
        userExists.email = updateRequest.email;
      }

      if (updateRequest.name) {
        userExists.name = updateRequest.name;
      }

      if (updateRequest.password) {
        userExists.password = updateRequest.password;
      }

      const user = userExists.toObject();
      const res = await UserModel.findByIdAndUpdate(id, user, { new: true });

      if (!res) {
        return NotFoundError("User not found");
      }

      return {
        id: res._id.toString(),
        name: res.name,
        email: res.email,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Internal Server Error");
    }
  }

  async updateSessionToken(
    email: string,
    token: string
  ): Promise<ErrorResponse | null> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { email },
        { $set: { sessionToken: token } }
      );

      if (!user) {
        return NotFoundError("User not found");
      }

      return null;
    } catch (error) {
      console.error("Error saving token:", error);
      throw new Error("Internal Server Error");
    }
  }

  async deleteSessionToken(email: string): Promise<ErrorResponse | null> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { email },
        { $set: { sessionToken: "" } }
      );

      if (!user) {
        return NotFoundError("User not found");
      }

      return null;
    } catch (error) {
      console.error("Error deleting token:", error);
      throw new Error("Internal Server Error");
    }
  }
}
