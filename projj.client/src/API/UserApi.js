import axios from "axios";

const baseUrl = "https://localhost:7057/api/";

const isLoggedIn = async () => {
  const response = await axios.get(`${baseUrl}User/is-logged-in`, {
    withCredentials: true,
  });
  return response.data;
};

const getCurrentUser = async () => {
  const response = await axios.get(`${baseUrl}User/current-user`, {
    withCredentials: true,
  });
  return response.data;
};

const loginUser = async (loginData) => {
  const response = await axios.post(`${baseUrl}User/login`, loginData, {
    withCredentials: true,
  });
  console.log(response);
  return response.data;
};

const logoutUser = async () => {
  const response = await axios.get(`${baseUrl}User/logout`, {
    withCredentials: true,
  });
  return response.data;
};

export { isLoggedIn, getCurrentUser, loginUser, logoutUser };
