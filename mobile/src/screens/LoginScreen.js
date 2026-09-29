import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";


export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // =========================
  // LOGIN
  // =========================

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert(
        "Login failed",
        error?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* =========================
              LOGO
          ========================= */}

          <Text style={styles.logo}>
            feedants
          </Text>


          {/* =========================
              TITLE
          ========================= */}

          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Login to continue to Feedants
          </Text>


          {/* =========================
              FORM
          ========================= */}

          <View style={styles.form}>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6B7890"
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9AA5B5"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>


            {/* PASSWORD */}

            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6B7890"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9AA5B5"
                secureTextEntry={!showPassword}
                style={styles.input}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={20}
                  color="#6B7890"
                />
              </Pressable>
            </View>


            {/* LOGIN BUTTON */}

            <Pressable
              style={[
                styles.button,
                submitting && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>
                {submitting
                  ? "Logging in..."
                  : "Login"}
              </Text>
            </Pressable>

          </View>


          {/* =========================
              REGISTER
          ========================= */}

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate("Register")
              }
              hitSlop={8}
            >
              <Text style={styles.registerLink}>
                Register
              </Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F8",
  },

  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  /* =========================
     LOGO
  ========================= */

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#078895",
    marginBottom: 28,
    letterSpacing: -0.5,
  },

  /* =========================
     TITLE
  ========================= */

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#17345F",
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: "#6B7890",
  },

  /* =========================
     FORM
  ========================= */

  form: {
    marginTop: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#17345F",
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8EC",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 17,
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: 15,
    color: "#17345F",
  },

  /* =========================
     BUTTON
  ========================= */

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#078895",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  /* =========================
     REGISTER
  ========================= */

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    flexWrap: "wrap",
  },

  registerText: {
    fontSize: 14,
    color: "#6B7890",
  },

  registerLink: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "800",
    color: "#078895",
  },
});