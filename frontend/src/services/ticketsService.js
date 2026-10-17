import api from "./api";

export const getTickets = async () => {
  const { data } = await api.get("/tickets");
  return data;
};

export const storeTicket = async (payload) => {
  const { data } = await api.post("/tickets", payload);
  return data;
};

export const showTicket = async (id) => {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
};

export const updateTicket = async (id, payload) => {
  const { data } = await api.put(`/tickets/${id}`, payload);
  return data;
};

export const deleteTicket = async (id) => {
  const { data } = await api.delete(`/tickets/${id}`);
  return data;
};
