export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

export type UserResponse = {
  id: string;
  name: string;
  email: string;
};

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface UserAuth {
  email: string;
  password: string;
  accessToken?: string;
}

export type UpdateUserRequest = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
};
