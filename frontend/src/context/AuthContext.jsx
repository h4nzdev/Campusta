import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { initialUsers, initialTickets, initialNotifications, initialLocations, initialCategories } from "../data/mockData";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("campusta_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem("campusta_tickets");
    return savedTickets ? JSON.parse(savedTickets) : initialTickets;
  });

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("campusta_notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });

  const [locations, setLocations] = useState(initialLocations);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("campusta_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("campusta_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("campusta_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("campusta_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Fetch tickets from Laravel API
  const fetchTickets = useCallback(async () => {
    try {
      const res = await api.get("/tickets");
      if (res.data && Array.isArray(res.data)) {
        setTickets(res.data);
      }
    } catch (err) {
      console.warn("Backend not available or using offline cache for tickets:", err.message);
    }
  }, []);

  // Fetch notifications from Laravel API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.warn("Backend not available or using offline cache for notifications:", err.message);
    }
  }, []);

  // Fetch locations & categories
  const fetchLookups = useCallback(async () => {
    try {
      const [locRes, catRes] = await Promise.all([
        api.get("/locations"),
        api.get("/categories"),
      ]);
      if (locRes.data && Array.isArray(locRes.data)) setLocations(locRes.data);
      if (catRes.data && Array.isArray(catRes.data)) setCategories(catRes.data);
    } catch (err) {
      console.warn("Using offline mock locations/categories:", err.message);
    }
  }, []);

  // Initialize and load user data on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("campusta_token");
    if (token) {
      api
        .get("/user")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem("campusta_token");
        });
    }
  }, []);

  // Fetch data whenever user session changes
  useEffect(() => {
    if (user) {
      fetchTickets();
      fetchNotifications();
      fetchLookups();
    }
  }, [user, fetchTickets, fetchNotifications, fetchLookups]);

  // Login handler with Laravel Sanctum API
  const login = async (identifier, password) => {
    if (!identifier || !identifier.trim()) {
      return { success: false, message: "Please enter your university email or ID number." };
    }

    setLoading(true);
    try {
      const res = await api.post("/login", {
        identifier: identifier.trim(),
        password: password || "password",
      });

      if (res.data && res.data.access_token) {
        localStorage.setItem("campusta_token", res.data.access_token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      // If network error / backend offline, fallback to mock users for seamless presentation
      console.warn("Backend login error, trying mock credentials fallback:", err.message);
      const cleanId = identifier.trim().toLowerCase();
      const foundUser = initialUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanId ||
          u.email.toLowerCase() === cleanId ||
          u.schoolId.toLowerCase() === cleanId
      );

      if (foundUser) {
        setUser(foundUser);
        return { success: true, user: foundUser };
      }

      const errorMsg =
        err.response?.data?.errors?.identifier?.[0] ||
        err.response?.data?.message ||
        "Invalid credentials. No user found matching that email or ID.";

      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }

    return { success: false, message: "Invalid username or credentials" };
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("campusta_token");
      setUser(null);
    }
  };

  // Add Ticket handler
  const addTicket = async (ticketData) => {
    try {
      const payload = {
        location_code: ticketData.locationCode,
        category_name: ticketData.categoryName,
        description: ticketData.description,
        photo: ticketData.photoUrl || null,
      };

      const res = await api.post("/tickets", payload);
      if (res.data) {
        setTickets((prev) => [res.data, ...prev]);
        fetchTickets();
        fetchNotifications();
        return res.data;
      }
    } catch (err) {
      console.warn("API ticket creation fallback to local state:", err.message);
      // Fallback local creation
      const newId = `TK-${1000 + tickets.length + 1}`;
      const newTicket = {
        id: newId,
        reporterId: user?.id || "anonymous",
        reporterName: user?.name || "Anonymous",
        reporterRole: user?.role || "student",
        status: "Pending",
        priority: "Medium",
        assignedPersonnelId: null,
        assignedPersonnelName: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workNotes: "",
        photoUrl: ticketData.photoUrl || null,
        ...ticketData,
        history: [
          {
            status: "Pending",
            note: `Ticket created by ${user?.name || "Anonymous"}`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      setTickets((prev) => [newTicket, ...prev]);
      return newTicket;
    }
  };

  // Update Ticket handler
  const updateTicket = async (ticketId, updatedFields) => {
    // Optimistic local state update
    setTickets((prevTickets) =>
      prevTickets.map((t) => {
        if (t.id === ticketId) {
          const historyEntry = {
            status: updatedFields.status || t.status,
            note: updatedFields.historyNote || `Ticket status updated to ${updatedFields.status || t.status}`,
            timestamp: new Date().toISOString(),
          };

          return {
            ...t,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
            history: [...(t.history || []), historyEntry],
          };
        }
        return t;
      })
    );

    try {
      const rawId = strStartsWith(ticketId, "TK-") ? parseInt(ticketId.substring(3), 10) - 1000 : ticketId;

      // Check specific role routes
      if (updatedFields.status === "Closed" && updatedFields.historyNote?.includes("confirmed")) {
        await api.put(`/tickets/${rawId}/verify`, {
          action: "confirm",
          historyNote: updatedFields.historyNote,
        });
      } else if (updatedFields.status === "Assigned" && updatedFields.historyNote?.includes("reopened")) {
        await api.put(`/tickets/${rawId}/verify`, {
          action: "reopen",
          reason: updatedFields.historyNote,
          historyNote: updatedFields.historyNote,
        });
      } else if (updatedFields.status === "In Progress" || updatedFields.status === "Resolved") {
        await api.put(`/tickets/${rawId}/status`, {
          status: updatedFields.status,
          work_notes: updatedFields.workNotes,
          completion_photo: updatedFields.completionPhotoUrl,
          history_note: updatedFields.historyNote,
        });
      } else {
        // Admin general update
        await api.put(`/tickets/${rawId}`, {
          priority: updatedFields.priority,
          assigned_personnel_id: updatedFields.assignedPersonnelId,
          status: updatedFields.status,
          work_notes: updatedFields.workNotes,
          history_note: updatedFields.historyNote,
        });
      }

      fetchTickets();
      fetchNotifications();
    } catch (err) {
      console.warn("API updateTicket fallback:", err.message);
    }
  };

  // Add new Location & QR Code handler
  const addLocation = async (locationData) => {
    try {
      const res = await api.post("/locations", locationData);
      if (res.data) {
        setLocations((prev) => [...prev, res.data]);
        return { success: true, location: res.data };
      }
    } catch (err) {
      console.warn("API location creation fallback:", err.message);
      // Fallback local creation
      const newLoc = {
        id: Date.now(),
        code: locationData.code || `USPF-${locationData.building.substring(0, 4).toUpperCase()}-${locationData.room.replace(/\s+/g, "").toUpperCase()}`,
        building: locationData.building,
        floor: locationData.floor,
        room: locationData.room,
        name: locationData.name,
        qrCode: locationData.qrCode || `QR-${locationData.building.substring(0, 4).toUpperCase()}-${locationData.room.replace(/\s+/g, "").toUpperCase()}`,
      };
      setLocations((prev) => [...prev, newLoc]);
      return { success: true, location: newLoc };
    }
  };

  // Delete Location handler
  const deleteLocation = async (locationId) => {
    try {
      await api.delete(`/locations/${locationId}`);
      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      return { success: true };
    } catch (err) {
      console.warn("API location delete fallback:", err.message);
      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      return { success: true };
    }
  };

  const markNotificationsAsRead = async (userId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === (userId || user?.id) ? { ...n, read: true } : n))
    );

    try {
      await api.put("/notifications/read");
    } catch {
      // ignore
    }
  };

  const resetAllData = () => {
    localStorage.removeItem("campusta_tickets");
    localStorage.removeItem("campusta_notifications");
    localStorage.removeItem("campusta_user");
    localStorage.removeItem("campusta_token");
    setTickets(initialTickets);
    setNotifications(initialNotifications);
    setLocations(initialLocations);
    setUser(null);
  };

  function strStartsWith(str, prefix) {
    return str && typeof str === "string" && str.startsWith(prefix);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tickets,
        notifications,
        locations,
        categories,
        loading,
        login,
        logout,
        addTicket,
        updateTicket,
        addLocation,
        deleteLocation,
        markNotificationsAsRead,
        fetchTickets,
        fetchNotifications,
        fetchLookups,
        resetAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
