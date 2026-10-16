import api from "./api";

export const login = async ({ identifier, password }) => {
  const { data } = await api.post("/login", { identifier, password });
  return data;
};

export const register = async ({ name, email, password }) => {
  const { data } = await api.post("/register", { name, email, password });
  return data;
};
