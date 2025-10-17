// // utils/auth.js
// export const saveAuth = (token, user = null) => {
//   localStorage.setItem('token', token)
//   if (user) {
//     localStorage.setItem('user', JSON.stringify(user))
//   }
// }

// export const clearAuth = () => {
//   localStorage.removeItem('token')
//   localStorage.removeItem('user')
// }



// src/utils/auth.js

export const saveAuth = (token, user = null) => {
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error("Failed to parse user:", err);
    return null;
  }
};

// ✅ ADD THIS FUNCTION 👇
export const getToken = () => {
  return localStorage.getItem('token');
};