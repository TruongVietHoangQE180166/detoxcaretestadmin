export type LoginResponse = {
  data: {
    accessToken: string;
    userId: string;
    userName: string;
    email: string;
    roles: string;
  }
};

export type UserResponse = {
  data: {
    username: string;
    password: string;
    email: string;
    status: string;
    role: string;
    deleted: boolean;
  }
};
