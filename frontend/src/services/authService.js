import api from "./api";

export const login = async ({ identifier, password }) => {
  const { data } = await api.post("/login", { identifier, password });
  return data;
};

export const register = async ({ name, email, password, school_id, username, role, department, course, year_level, contact, profile_pic }) => {
  const { data } = await api.post("/register", {
    name,
    email,
    password,
    school_id,
    username,
    role,
    department,
    course,
    year_level,
    contact,
    profile_pic,
  });
  return data;
};
