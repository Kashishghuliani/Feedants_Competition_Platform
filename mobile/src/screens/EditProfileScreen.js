import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";


export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert(
        "Name required",
        "Please enter your name."
      );
      return;
    }

    if (!trimmedEmail) {
      Alert.alert(
        "Email required",
        "Please enter your email."
      );
      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });

      Alert.alert(
        "Profile updated",
        "Your profile has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        "EDIT PROFILE ERROR:",
        error
      );

      Alert.alert(
        "Update failed",
        error?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }


  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={["top", "bottom", "left", "right"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <View
            className="flex-row items-center px-5 pb-4"
            style={{ paddingTop: 3 }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#17345F"
              />
            </Pressable>

            <Text className="ml-3 text-xl font-extrabold text-feedants-navy">
              Edit Profile
            </Text>
          </View>


          {/* =================================================
              PROFILE HEADER CARD
          ================================================= */}

          <View className="mx-4 rounded-2xl border border-slate-100 bg-white p-5">
            <View className="items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-teal-50">
                <Ionicons
                  name="person"
                  size={38}
                  color="#078895"
                />
              </View>

              <Text className="mt-3 text-base font-extrabold text-feedants-navy">
                Update your profile
              </Text>

              <Text className="mt-1 text-center text-xs text-slate-500">
                Keep your account information up to date.
              </Text>
            </View>
          </View>


          {/* =================================================
              FORM
          ================================================= */}

          <View className="mx-4 mt-5 rounded-2xl border border-slate-100 bg-white p-5">

            {/* NAME */}

            <Text className="mb-2 text-sm font-bold text-feedants-navy">
              Name
            </Text>

            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
              <Ionicons
                name="person-outline"
                size={19}
                color="#6B7890"
              />

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!saving}
                className="ml-2 flex-1"
                style={{
                  height: 52,
                  fontSize: 15,
                  color: "#17345F",
                }}
              />
            </View>


            {/* EMAIL */}

            <Text className="mb-2 mt-5 text-sm font-bold text-feedants-navy">
              Email
            </Text>

            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
              <Ionicons
                name="mail-outline"
                size={19}
                color="#6B7890"
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!saving}
                className="ml-2 flex-1"
                style={{
                  height: 52,
                  fontSize: 15,
                  color: "#17345F",
                }}
              />
            </View>


            {/* SAVE BUTTON */}

            <Pressable
              onPress={handleSave}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Save profile changes"
              className="mt-6 h-[52px] items-center justify-center rounded-xl bg-feedants-teal"
              style={{
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? (
                <View className="flex-row items-center">
                  <Ionicons
                    name="sync-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-base font-extrabold text-white">
                    Saving...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Ionicons
                    name="checkmark-outline"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-base font-extrabold text-white">
                    Save Changes
                  </Text>
                </View>
              )}
            </Pressable>


            {/* CANCEL */}

            <Pressable
              onPress={() => navigation.goBack()}
              disabled={saving}
              className="mt-3 h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white"
              style={{
                opacity: saving ? 0.5 : 1,
              }}
            >
              <Text className="text-sm font-bold text-feedants-navy">
                Cancel
              </Text>
            </Pressable>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}