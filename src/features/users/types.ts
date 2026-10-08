export type UserRole = "admin" | "manager" | "staff";
export type UserStatus = "active" | "inactive";

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
}

export interface UpdateUserInput {
  username?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
}
