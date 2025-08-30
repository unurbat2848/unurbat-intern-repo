export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export interface UserPermission {
  resource: string;
  action: string;
}