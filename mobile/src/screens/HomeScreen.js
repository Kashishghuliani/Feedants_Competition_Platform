import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";

import { getCompetitions } from "../services/api";
import { useAuth } from "../context/AuthContext";

import HomeHeader from "../components/home/HomeHeader";
import HomeIntro from "../components/home/HomeIntro";
import CompetitionCard from "../components/home/CompetitionCard";
import EmptyCompetitions from "../components/home/EmptyCompetitions";


// =====================================================
// SCREEN
// =====================================================

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // LOAD COMPETITIONS
  // =====================================================

  const loadCompetitions = useCallback(async () => {
    try {
      const response = await getCompetitions();

      console.log("Competitions response:", response);

      setCompetitions(response?.competitions || []);
    } catch (error) {
      console.log("Load competitions error:", error);

      Alert.alert(
        "Unable to load competitions",
        error?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  React.useEffect(() => {
    loadCompetitions();
  }, [loadCompetitions]);

  // =====================================================
  // REFRESH
  // =====================================================

  async function handleRefresh() {
    setRefreshing(true);

    try {
      await loadCompetitions();
    } finally {
      setRefreshing(false);
    }
  }

  // =====================================================
  // OPEN COMPETITION
  // =====================================================

  function handleCompetitionPress(competition) {
    console.log(
      "Opening competition:",
      competition?._id
    );

    if (!competition?._id) {
      Alert.alert(
        "Error",
        "Competition ID is missing."
      );
      return;
    }

    navigation.navigate("Competition", {
      competitionId: competition._id,
    });
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F7FBFC",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#078895"
        />

        <Text
          style={{
            marginTop: 12,
            color: "#6B7890",
          }}
        >
          Loading competitions...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================================
  // HOME
  // =====================================================

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F7FBFC",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#078895"
          />
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <HomeHeader
          user={user}
          navigation={navigation}
        />

        {/* =================================================
            INTRO
        ================================================= */}

        <HomeIntro />

        {/* =================================================
            COMPETITIONS
        ================================================= */}

        {competitions.length === 0 ? (
          <EmptyCompetitions />
        ) : (
          competitions.map((competition) => (
            <CompetitionCard
              key={competition._id}
              competition={competition}
              onPress={() =>
                handleCompetitionPress(competition)
              }
            />
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}