import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { getMyCompetitions } from "../services/api";


// =====================================================
// SCREEN
// =====================================================

export default function MyCompetitionsScreen({ navigation }) {

  // =====================================================
  // STATE
  // =====================================================

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  // =====================================================
  // LOAD MY COMPETITIONS
  // =====================================================

  const loadMyCompetitions = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const response = await getMyCompetitions();

        console.log(
          "MY COMPETITIONS RESPONSE:",
          response
        );

        if (
          response?.success &&
          Array.isArray(response.competitions)
        ) {
          setCompetitions(response.competitions);
        } else {
          setCompetitions([]);
        }
      } catch (error) {
        console.log(
          "MY COMPETITIONS ERROR:",
          error
        );

        Alert.alert(
          "Unable to load competitions",
          error?.message ||
            "Something went wrong while loading your competitions."
        );

        setCompetitions([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // =====================================================
  // LOAD WHEN SCREEN OPENS
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      loadMyCompetitions();
    }, [loadMyCompetitions])
  );


  // =====================================================
  // REFRESH
  // =====================================================

  async function handleRefresh() {
    setRefreshing(true);
    await loadMyCompetitions(false);
  }


  // =====================================================
  // OPEN COMPETITION
  // =====================================================

  function handleCompetitionPress(competition) {
    const id = competition?._id || competition?.id;

    if (!id) {
      Alert.alert(
        "Error",
        "Competition ID is missing."
      );
      return;
    }

    navigation.navigate("Competition", {
      competitionId: id,
    });
  }


  // =====================================================
  // HEADER
  // =====================================================

  function renderHeader() {
    return (
      <View className="flex-row items-center bg-slate-50 px-5 pb-4 pt-3">
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

        <View className="ml-3">
          <Text className="text-xl font-extrabold text-feedants-navy">
            My Competitions
          </Text>

          <Text className="mt-0.5 text-xs text-slate-500">
            Competitions you have joined
          </Text>
        </View>
      </View>
    );
  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 bg-slate-50"
        edges={["top", "bottom", "left", "right"]}
      >
        {renderHeader()}

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#078895"
          />

          <Text className="mt-3 text-sm text-slate-500">
            Loading your competitions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={["top", "bottom", "left", "right"]}
    >
      {renderHeader()}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#078895"
          />
        }
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
          flexGrow:
            competitions.length === 0
              ? 1
              : undefined,
        }}
      >

        {/* =================================================
            COMPETITIONS
        ================================================= */}

        {competitions.length > 0 ? (
          competitions.map((competition, index) => {
            const id = competition?._id || competition?.id;

            return (
              <Pressable
                key={id || index}
                onPress={() =>
                  handleCompetitionPress(competition)
                }
                className="mb-3 rounded-2xl border border-slate-100 bg-white p-4"
              >
                <View className="flex-row items-center">

                  {/* ICON */}

                  <View className="h-11 w-11 items-center justify-center rounded-full bg-teal-50">
                    <Ionicons
                      name="trophy-outline"
                      size={22}
                      color="#078895"
                    />
                  </View>


                  {/* DETAILS */}

                  <View className="ml-3 flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-base font-extrabold text-feedants-navy"
                    >
                      {competition?.title || "Competition"}
                    </Text>

                    <Text className="mt-1 text-xs text-slate-500">
                      {competition?.category
                        ? `${competition.category} • `
                        : ""}
                      Registered
                    </Text>

                    {competition?.registeredAt ? (
                      <Text className="mt-1 text-[11px] text-slate-400">
                        Joined{" "}
                        {new Date(
                          competition.registeredAt
                        ).toLocaleDateString()}
                      </Text>
                    ) : null}
                  </View>


                  {/* ARROW */}

                  <Ionicons
                    name="chevron-forward"
                    size={19}
                    color="#94A3B8"
                  />
                </View>
              </Pressable>
            );
          })
        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <View className="flex-1 items-center justify-center py-20">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-teal-50">
              <Ionicons
                name="trophy-outline"
                size={42}
                color="#CBD5E1"
              />
            </View>

            <Text className="mt-4 text-base font-extrabold text-slate-500">
              No competitions yet
            </Text>

            <Text className="mt-1 px-8 text-center text-xs text-slate-400">
              Competitions you participate in will appear here.
            </Text>

            <Pressable
              onPress={() => navigation.navigate("Home")}
              className="mt-5 rounded-xl bg-feedants-teal px-5 py-3"
            >
              <Text className="text-sm font-extrabold text-white">
                Browse Competitions
              </Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
