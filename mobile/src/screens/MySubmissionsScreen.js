import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMySubmissions } from "../services/api";


// =====================================================
// SCREEN
// =====================================================

export default function MySubmissionsScreen({ navigation }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  // =====================================================
  // LOAD MY SUBMISSIONS
  // =====================================================

  const loadSubmissions = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        console.log("================================");
        console.log("LOADING MY SUBMISSIONS...");

        const response = await getMySubmissions();

        console.log(
          "MY SUBMISSIONS RESPONSE:",
          JSON.stringify(response, null, 2)
        );

        // =================================================
        // HANDLE RESPONSE
        // =================================================

        let data = [];

        if (Array.isArray(response)) {
          data = response;
        } else if (Array.isArray(response?.submissions)) {
          data = response.submissions;
        } else if (Array.isArray(response?.data)) {
          data = response.data;
        } else if (
          Array.isArray(response?.data?.submissions)
        ) {
          data = response.data.submissions;
        }

        console.log("SUBMISSIONS FOUND:", data.length);

        setSubmissions(data);
      } catch (error) {
        console.log("================================");
        console.log("MY SUBMISSIONS ERROR:", error);
        console.log("ERROR MESSAGE:", error?.message);
        console.log("ERROR STATUS:", error?.status);
        console.log("ERROR CODE:", error?.code);

        setSubmissions([]);

        Alert.alert(
          "Unable to load submissions",
          error?.message ||
            "Something went wrong while loading your submissions."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);


  // =====================================================
  // REFRESH
  // =====================================================

  async function handleRefresh() {
    setRefreshing(true);
    await loadSubmissions(false);
  }


  // =====================================================
  // OPEN SUBMISSION
  // =====================================================

  async function openSubmission(submission) {
    const url =
      submission?.submissionUrl ||
      submission?.fileUrl ||
      submission?.file?.url ||
      submission?.file?.secure_url;

    if (!url) {
      Alert.alert(
        "Submission",
        "No submission file or link is available."
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "Unable to open",
          "This submission link cannot be opened on your device."
        );
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.log(
        "OPEN SUBMISSION ERROR:",
        error
      );

      Alert.alert(
        "Unable to open submission",
        "Something went wrong while opening the submission."
      );
    }
  }


  // =====================================================
  // GET COMPETITION NAME
  // =====================================================

  function getCompetitionName(submission) {
    return (
      submission?.competitionName ||
      submission?.competition?.title ||
      submission?.competition?.name ||
      submission?.competition?.competitionName ||
      "Competition submission"
    );
  }


  // =====================================================
  // GET SUBMISSION TITLE
  // =====================================================

  function getSubmissionTitle(submission) {
    return submission?.title || submission?.name || "Submission";
  }


  // =====================================================
  // GET STATUS
  // =====================================================

  function getSubmissionStatus(submission) {
    return submission?.status || "Submitted";
  }


  // =====================================================
  // HEADER
  // =====================================================

  function renderHeader() {
    return (
      <View className="flex-row items-center px-5 pb-4 pt-3">
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
            My Submissions
          </Text>

          <Text className="mt-0.5 text-xs text-slate-500">
            Your competition entries
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
            Loading your submissions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  // =====================================================
  // SCREEN
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
            submissions.length === 0
              ? 1
              : 0,
        }}
      >

        {/* =================================================
            SUBMISSIONS
        ================================================= */}

        {submissions.length > 0 ? (
          submissions.map((submission, index) => {
            const submissionId =
              submission?._id ||
              submission?.id ||
              `submission-${index}`;

            const submissionUrl =
              submission?.submissionUrl ||
              submission?.fileUrl ||
              submission?.file?.url ||
              submission?.file?.secure_url;

            const competitionName =
              getCompetitionName(submission);

            const submissionTitle =
              getSubmissionTitle(submission);

            const status =
              getSubmissionStatus(submission);

            return (
              <Pressable
                key={submissionId}
                onPress={() => openSubmission(submission)}
                className="mb-3 rounded-2xl border border-slate-100 bg-white p-4"
              >
                <View className="flex-row items-center">

                  {/* ICON */}

                  <View className="h-11 w-11 items-center justify-center rounded-full bg-teal-50">
                    <Ionicons
                      name="document-text-outline"
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
                      {submissionTitle}
                    </Text>

                    <Text
                      numberOfLines={1}
                      className="mt-1 text-xs text-slate-500"
                    >
                      {competitionName}
                    </Text>

                    {submission?.createdAt ? (
                      <Text className="mt-1 text-[11px] text-slate-400">
                        Submitted{" "}
                        {new Date(
                          submission.createdAt
                        ).toLocaleDateString()}
                      </Text>
                    ) : null}

                    <Text className="mt-1 text-xs font-semibold text-feedants-teal">
                      {status}
                    </Text>
                  </View>


                  {/* OPEN ICON */}

                  <Ionicons
                    name={
                      submissionUrl
                        ? "open-outline"
                        : "document-outline"
                    }
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
                name="document-text-outline"
                size={42}
                color="#CBD5E1"
              />
            </View>

            <Text className="mt-4 text-base font-extrabold text-slate-500">
              No submissions yet
            </Text>

            <Text className="mt-1 px-8 text-center text-xs leading-5 text-slate-400">
              Your submitted competition entries will appear here.
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
