export interface UserResponse {
  username: string;
  email: string;
  id: number;
  createdAt: string;
  team?: string;
}

export interface ErrorResponse {
  errorMessage: string;
  errorCode: number;
}
