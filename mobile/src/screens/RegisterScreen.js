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

import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";


export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);


  // =====================================================
  // REGISTER
  // =====================================================

  async function handleRegister() {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing information",
        "Please fill all fields."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Invalid password",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords don't match",
        "Please enter the same password twice."
      );
      return;
    }

    try {
      setSubmitting(true);

      await register(
        name.trim(),
        email.trim(),
        password
      );

      Alert.alert(
        "Account created",
        "Your account has been created successfully.",
        [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error?.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >

          {/* BACK */}

          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>


          {/* HEADER */}

          <Text style={styles.logo}>feedants</Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            style={styles.title}
          >
            Create account
          </Text>

          <Text style={styles.subtitle}>
            Join Feedants and start participating
          </Text>


          {/* FORM */}

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9AA5B5"
              autoCapitalize="words"
              returnKeyType="next"
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9AA5B5"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
              placeholderTextColor="#9AA5B5"
              secureTextEntry
              returnKeyType="next"
              style={styles.input}
            />

            <Text style={styles.label}>Confirm password</Text>

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat password"
              placeholderTextColor="#9AA5B5"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              style={styles.input}
            />

            <Pressable
              onPress={handleRegister}
              disabled={submitting}
              style={[
                styles.button,
                submitting && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>
                {submitting ? "Creating account..." : "Create account"}
              </Text>
            </Pressable>
          </View>


          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() => navigation.navigate("Login")}
              hitSlop={8}
            >
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


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

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 26,
  },

  backText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#078895",
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#078895",
    marginBottom: 28,
    letterSpacing: -0.5,
  },

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

  form: {
    marginTop: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#17345F",
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8EC",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#17345F",
    marginBottom: 17,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#078895",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
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

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    flexWrap: "wrap",
  },

  loginText: {
    fontSize: 14,
    color: "#6B7890",
  },

  loginLink: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "800",
    color: "#078895",
  },
});
