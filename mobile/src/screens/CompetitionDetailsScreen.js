import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getCompetition, participate } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getCompetitionStatus } from "../utils/competitionStatus";

import CompetitionHeader from "../components/competition/CompetitionHeader";
import CompetitionSummary from "../components/competition/CompetitionSummary";
import JudgeCard from "../components/competition/JudgeCard";
import RegistrationCountdown from "../components/competition/RegistrationCountdown";
import ImportantDates from "../components/competition/ImportantDates";
import PreviousWinners from "../components/competition/PreviousWinners";
import CompetitionTabs from "../components/competition/CompetitionTabs";
import Rewards from "../components/competition/Rewards";
import Disclaimer from "../components/competition/Disclaimer";
import PrizeMoneyInfo from "../components/competition/PrizeMoneyInfo";
import ReferralCard from "../components/competition/ReferralCard";
import UserReviews from "../components/competition/UserReviews";
import AdBanner from "../components/competition/AdBanner";
import BottomNavigation from "../components/competition/BottomNavigation";

export default function CompetitionDetailsScreen({ route, navigation }) {
  const { competitionId } = route.params || {};
  const { user, loading: authLoading } = useAuth();

  const [competition, setCompetition] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [userParticipation, setUserParticipation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [participating, setParticipating] = useState(false);

  const loadCompetition = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCompetition(competitionId);

      setCompetition(response?.competition || null);
      setRegistration(response?.registration || null);
      setSubmission(response?.submission || null);
      setUserParticipation(response?.userParticipation || null);
    } catch (error) {
      Alert.alert(
        "Unable to load competition",
        error?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    if (!authLoading) loadCompetition();
  }, [authLoading, loadCompetition]);

  async function handleParticipate() {
    if (!user) {
      Alert.alert("Login required", "Please login to participate.");
      return;
    }

    const status = getCompetitionStatus(competition);

    if (userParticipation?.isRegistered) {
      navigation.navigate("UploadSubmission", { competitionId });
      return;
    }

    if (status !== "REGISTRATION_OPEN") {
      Alert.alert(
        "Registration Closed",
        "Registration for this competition is not available."
      );
      return;
    }

    const count = competition?.participantCount ?? 0;
    const max = competition?.maxParticipants ?? 0;
    const spots = registration?.spotsLeft ?? Math.max(max - count, 0);

    if (registration?.isFull || spots <= 0) {
      Alert.alert(
        "Registration Closed",
        "All participation spots have been taken."
      );
      return;
    }

    if (participating) return;

    try {
      setParticipating(true);

      const response = await participate(competitionId);

      setUserParticipation(
        response?.userParticipation || { isRegistered: true }
      );

      setRegistration((prev) => {
        const current = prev?.spotsLeft ?? spots;
        const left =
          response?.competition?.spotsLeft ??
          Math.max(current - 1, 0);

        return {
          ...(prev || {}),
          spotsLeft: left,
          isFull: left <= 0,
        };
      });

      setCompetition((prev) => ({
        ...(prev || {}),
        participantCount:
          response?.competition?.participantCount ??
          (prev?.participantCount ?? 0) + 1,
      }));

      Alert.alert(
        "Success",
        "You have successfully registered for this competition."
      );
    } catch (error) {
      if (error?.code === "ALREADY_REGISTERED") {
        setUserParticipation({ isRegistered: true });
        Alert.alert(
          "Already Registered",
          "You are already registered for this competition."
        );
      } else if (error?.code === "COMPETITION_FULL") {
        setRegistration((prev) => ({
          ...(prev || {}),
          isFull: true,
          spotsLeft: 0,
        }));
        Alert.alert(
          "Registration Closed",
          "All participation spots have been taken."
        );
      } else if (error?.code === "REGISTRATION_CLOSED") {
        Alert.alert(
          "Registration Closed",
          "Registration for this competition has ended."
        );
      } else if (error?.code === "COMPETITION_NOT_FOUND") {
        Alert.alert(
          "Competition Not Found",
          "This competition is no longer available."
        );
      } else {
        Alert.alert(
          "Unable to participate",
          error?.message || "Something went wrong."
        );
      }
    } finally {
      setParticipating(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await loadCompetition();
    } finally {
      setRefreshing(false);
    }
  }

  function handleUploadSubmission() {
    if (!user) {
      Alert.alert("Login required", "Please login first.");
      return;
    }

    if (!userParticipation?.isRegistered) {
      Alert.alert(
        "Registration required",
        "You must register for this competition before uploading a submission."
      );
      return;
    }

    if (submission && !submission.isOpen && submission.hasEnded) {
      Alert.alert(
        "Submission Closed",
        "The submission deadline has passed."
      );
      return;
    }

    if (submission && !submission.isOpen && !submission.hasStarted) {
      Alert.alert(
        "Submission Not Started",
        "Submission has not started yet."
      );
      return;
    }

    navigation.navigate("UploadSubmission", { competitionId });
  }

  function showVideo(title, message) {
    Alert.alert(title, message);
  }

  if (authLoading || loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#078895" />
        <Text className="mt-3 text-sm text-slate-500">
          {authLoading
            ? "Checking your account..."
            : "Loading competition..."}
        </Text>
      </SafeAreaView>
    );
  }

  if (!competition) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-xl font-extrabold text-feedants-navy">
          Competition unavailable
        </Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          We couldn't load this competition.
        </Text>
      </SafeAreaView>
    );
  }

  const status = getCompetitionStatus(competition);
  const isRegistered = Boolean(userParticipation?.isRegistered);
  const count = competition?.participantCount ?? 0;
  const max = competition?.maxParticipants ?? 0;
  const spots = registration?.spotsLeft ?? Math.max(max - count, 0);
  const isFull = Boolean(registration?.isFull) || spots <= 0;

  function renderButton() {
    if (isRegistered) {
      const ended =
        submission?.hasEnded ??
        (competition?.submissionEnd
          ? new Date() > new Date(competition.submissionEnd)
          : false);

      if (ended) {
        return (
          <View className="mx-4 mt-3">
            <View className="min-h-[58px] items-center justify-center rounded-xl bg-slate-200 px-4">
              <View className="flex-row items-center">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#64748B"
                />
                <Text className="ml-2 text-base font-extrabold text-slate-500">
                  Submission Closed
                </Text>
              </View>
              <Text className="mt-0.5 text-xs text-slate-400">
                The submission deadline has passed
              </Text>
            </View>
          </View>
        );
      }

      return (
        <View className="mx-4 mt-3">
          <Pressable
            onPress={handleUploadSubmission}
            className="min-h-[58px] items-center justify-center rounded-xl bg-feedants-teal px-4"
          >
            <Text className="text-base font-extrabold text-white">
              Upload Submission
            </Text>
            <View className="mt-0.5 flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#FFFFFF"
              />
              <Text className="ml-1 text-xs text-white">
                Registered • Submission Open
              </Text>
            </View>
          </Pressable>
        </View>
      );
    }

    if (isFull || status === "REGISTRATION_CLOSED") {
      return (
        <View className="mx-4 mt-3">
          <View className="min-h-[58px] items-center justify-center rounded-xl bg-slate-200 px-4">
            <View className="flex-row items-center">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#64748B"
              />
              <Text className="ml-2 text-base font-extrabold text-slate-500">
                Registration Closed
              </Text>
            </View>
            {isFull && (
              <Text className="mt-0.5 text-xs text-slate-400">
                All participation spots have been taken
              </Text>
            )}
          </View>
        </View>
      );
    }

    if (status === "LIVE") {
      return (
        <View className="mx-4 mt-3">
          <View className="min-h-[58px] items-center justify-center rounded-xl bg-slate-200">
            <View className="flex-row items-center">
              <Ionicons
                name="radio-outline"
                size={18}
                color="#64748B"
              />
              <Text className="ml-2 text-base font-extrabold text-slate-500">
                Competition Live
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (status === "ENDED") {
      return (
        <View className="mx-4 mt-3">
          <View className="min-h-[58px] items-center justify-center rounded-xl bg-slate-200">
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color="#64748B"
              />
              <Text className="ml-2 text-base font-extrabold text-slate-500">
                Competition Ended
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className="mx-4 mt-3">
        <Pressable
          onPress={handleParticipate}
          disabled={participating}
          className={`min-h-[58px] items-center justify-center rounded-xl px-4 ${
            participating ? "bg-teal-300" : "bg-feedants-teal"
          }`}
        >
          <View className="flex-row items-center">
            {participating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name="trophy-outline"
                size={20}
                color="#FFFFFF"
              />
            )}
            <Text className="ml-2 text-base font-extrabold text-white">
              {participating ? "Registering..." : "Participate"}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <CompetitionHeader navigation={navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#078895"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <CompetitionSummary
          competition={competition}
          registration={registration}
          userParticipation={userParticipation}
          status={status}
        />

        <JudgeCard
          judge={competition.judge}
          onVideoPress={() =>
            showVideo(
              "Intro Video",
              "The judge introduction video will be available here."
            )
          }
        />

        {status === "REGISTRATION_OPEN" &&
          competition.registrationDeadline && (
            <RegistrationCountdown
              targetDate={competition.registrationDeadline}
            />
          )}

        <ImportantDates competition={competition} />

        <PreviousWinners
          winners={competition.previousWinners}
          onVideoPress={(winner) =>
            showVideo(
              "Winner Video",
              `The video for ${
                typeof winner === "object"
                  ? winner?.name || winner?.username || "this winner"
                  : winner || "this winner"
              } will be available here.`
            )
          }
        />

        <CompetitionTabs competition={competition} />
        <Rewards rewards={competition.rewards} />
        <Disclaimer text={competition.disclaimer} />

        <PrizeMoneyInfo
          onVideoPress={() =>
            showVideo(
              "Prize Money",
              "The video explaining how you will receive your prize money will be available here."
            )
          }
        />

        <ReferralCard />

        <UserReviews
          onPress={() => navigation.navigate("UserReviews")}
        />

        <AdBanner />

        {renderButton()}

        <View className="h-5" />
      </ScrollView>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
}
