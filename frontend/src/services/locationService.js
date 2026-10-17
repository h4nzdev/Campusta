import api from "./api";

export const getLocations = async () => {
  const { data } = await api.get("/locations");
  return data;
};

export const store = async (payload) => {
  const { data } = await api.post("/locations", payload);
  return data;
};

export const showByQr = async (qrCode) => {
  const { data } = await api.get(`/locations/qr/${qrCode}`);
  return data;
};

export const destroy = async (id) => {
  const { data } = await api.delete(`/locations/${id}`);
  return data;
};
