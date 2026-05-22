import { create } from "zustand";
import api from "../api";
import { isAxiosError } from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  // LOGIN
  login: async (userCredObj) => {

    try {

      set({ loading: true, error: null });

      let res = await api.post("/common-api/login", userCredObj);

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        currentUser: res.data.payload
      });

      return res.data.payload;

    } catch (err) {

      if (isAxiosError(err)) {
        set({
          loading: false,
          error: err.response?.data?.message,
          isAuthenticated: false,
          currentUser: null
        });
      } else {
        set({
          loading: false,
          error: "Unexpected error",
          isAuthenticated: false,
          currentUser: null
        });
      }

      return null;
    }
  },

  // LOGOUT
  logout: async () => {

    await api.get("/common-api/logout");

    set({
      currentUser: null,
      isAuthenticated: false
    });

  },

  // CLEAR ERROR
  clearError: () => set({ error: null }),

  // restore login
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/common-api/check-auth");

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  }

}));