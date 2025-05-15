// User domain types
export interface User {
  id: number;
  name: string;
  email: string;
  city?: string;
  role: 'ADMIN' | 'USER';
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData extends UserCredentials {
  name: string;
  city?: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  city?: string;
  role?: 'ADMIN' | 'USER';
  password?: string;
}