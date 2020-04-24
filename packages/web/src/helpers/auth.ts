import decode from 'jwt-decode';

const ACCESS_TOKEN = 'TASK_APP';

export const login = (accessToken: string) => localStorage.setItem(ACCESS_TOKEN, accessToken);

export const isLoggedIn = () => {
  const token = getAccessToken();
  return !!token;
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  return;
};

type UserType = {
  id: string;
};

export const getUserDecoded = (): UserType | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  return decode(token);
};
