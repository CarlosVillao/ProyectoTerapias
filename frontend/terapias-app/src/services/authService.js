export const saveAuthData = (token, loginId) => {
  localStorage.setItem('token', token);
  localStorage.setItem('login_id', loginId);
};

export const getToken = () => localStorage.getItem('token');
export const getLoginId = () => localStorage.getItem('login_id');

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('login_id');
};

export const isAuthenticated = () => !!getToken();
