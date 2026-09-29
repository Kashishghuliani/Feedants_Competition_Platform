import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  updateProfile as updateProfileApi,
} from "../services/api";


// =====================================================
// CONTEXT
// =====================================================

const AuthContext = createContext(null);


// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  async function loadUser() {
    try {
      const token = await AsyncStorage.getItem("token");

      // No token means user is logged out
      if (!token) {
        setUser(null);
        return;
      }

      const response = await getCurrentUser();

      if (response?.user) {
        setUser(response.user);
      } else {
        await AsyncStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.log("LOAD USER ERROR:", error);

      await AsyncStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }


  // =====================================================
  // INITIAL AUTH CHECK
  // =====================================================

  useEffect(() => {
    loadUser();
  }, []);


  // =====================================================
  // LOGIN
  // =====================================================

  async function login(email, password) {
    try {
      const response = await loginUser(
        email,
        password
      );

      if (!response?.token) {
        throw new Error(
          "Login response does not contain a token."
        );
      }

      if (!response?.user) {
        throw new Error(
          "Login response does not contain user data."
        );
      }

      await AsyncStorage.setItem(
        "token",
        response.token
      );

      setUser(response.user);

      return response;
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      throw error;
    }
  }


  // =====================================================
  // REGISTER
  // =====================================================

  async function register(
    name,
    email,
    password
  ) {
    try {
      const response = await registerUser(
        name,
        email,
        password
      );

      if (!response) {
        throw new Error(
          "Registration failed."
        );
      }

      return response;
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      throw error;
    }
  }


  // =====================================================
  // LOGOUT
  // =====================================================

  async function logout() {
    try {
      await AsyncStorage.removeItem("token");

      setUser(null);
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
      throw error;
    }
  }


  // =====================================================
  // REFRESH USER
  // =====================================================

  async function refreshUser() {
    try {
      const token = await AsyncStorage.getItem(
        "token"
      );

      if (!token) {
        setUser(null);
        return null;
      }

      const response = await getCurrentUser();

      if (response?.user) {
        setUser(response.user);
        return response.user;
      }

      await AsyncStorage.removeItem("token");
      setUser(null);

      return null;
    } catch (error) {
      console.log(
        "REFRESH USER ERROR:",
        error
      );

      throw error;
    }
  }


  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  async function updateProfile({
    name,
    email,
  }) {
    try {
      const response =
        await updateProfileApi({
          name,
          email,
        });

      if (response?.user) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );

      throw error;
    }
  }


  // =====================================================
  // CONTEXT PROVIDER
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        register,
        logout,

        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}