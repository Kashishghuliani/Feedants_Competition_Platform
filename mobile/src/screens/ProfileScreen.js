import React from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert(
                "Logout failed",
                error?.message || "Unable to logout."
              );
            }
          },
        },
      ]
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View
          className="flex-row items-center px-5 pb-4"
          style={{ paddingTop: 12 }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#17345F"
            />
          </Pressable>

          <Text className="ml-3 text-xl font-extrabold text-feedants-navy">
            Profile
          </Text>
        </View>

        {/* =================================================
            PROFILE CARD
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

            <Text className="mt-3 text-xl font-extrabold text-feedants-navy">
              {user?.name || "User"}
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 text-sm text-slate-500"
            >
              {user?.email || "No email available"}
            </Text>

          </View>
        </View>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <View className="mx-4 mt-5">
          <Text className="mb-2 text-sm font-extrabold text-feedants-navy">
            Account
          </Text>

          {/* EDIT PROFILE */}

          <Pressable
            onPress={() => navigation.navigate("EditProfile")}
            className="mb-2 flex-row items-center rounded-xl border border-slate-100 bg-white p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
              <Ionicons
                name="create-outline"
                size={21}
                color="#078895"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-feedants-navy">
                Edit Profile
              </Text>

              <Text className="mt-0.5 text-xs text-slate-500">
                Update your name and email
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94A3B8"
            />
          </Pressable>

          {/* MY COMPETITIONS */}

          <Pressable
            onPress={() => navigation.navigate("MyCompetitions")}
            className="mb-2 flex-row items-center rounded-xl border border-slate-100 bg-white p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
              <Ionicons
                name="trophy-outline"
                size={21}
                color="#078895"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-feedants-navy">
                My Competitions
              </Text>

              <Text className="mt-0.5 text-xs text-slate-500">
                View competitions you joined
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94A3B8"
            />
          </Pressable>

          {/* MY SUBMISSIONS */}

          <Pressable
            onPress={() => navigation.navigate("MySubmissions")}
            className="mb-2 flex-row items-center rounded-xl border border-slate-100 bg-white p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-50">
              <Ionicons
                name="document-text-outline"
                size={21}
                color="#078895"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-feedants-navy">
                My Submissions
              </Text>

              <Text className="mt-0.5 text-xs text-slate-500">
                View your submitted entries
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#94A3B8"
            />
          </Pressable>
        </View>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <View className="mx-4 mt-5">
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center justify-center rounded-xl bg-white p-4"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#DC2626"
            />

            <Text className="ml-2 text-sm font-extrabold text-red-600">
              Logout
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
