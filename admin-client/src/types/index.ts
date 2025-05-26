export type User = {
  id: number;
  email: string;
  role: string;
};

export type LoginType = {
    email: string,
    password: string,
    rememberMe: boolean
}