export type LoginResponse = {
  data: {
    accessToken: string;
    userId: string;
    username: string;  // Fixed: changed from userName to username to match actual API response
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