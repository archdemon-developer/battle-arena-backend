export interface UserResponse {
  username: string;
  email: string;
  id: number;
  createdAt: string;
  team?: TeamResponse;
}

export interface TeamResponse {
  teamname: string;
  email: string;
  id: number;
  createdAt: string;
  users?: UserResponse[];
}

export interface ErrorResponse {
  errorMessage: string;
  errorCode: number;
}
