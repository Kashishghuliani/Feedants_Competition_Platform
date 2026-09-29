import React from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function CompetitionSummary({
  competition,
  registration,
  userParticipation,
  status,
  onParticipate,
  participating,
}) {
  const { width } = useWindowDimensions();

  // =========================================
  // REGISTRATION DATA
  // =========================================

  const isRegistered = Boolean(
    userParticipation?.isRegistered
  );

  const participantCount =
    competition?.participantCount ?? 0;

  const maxParticipants =
    competition?.maxParticipants ?? 0;

  const spotsLeft =
    registration?.spotsLeft ??
    Math.max(
      maxParticipants - participantCount,
      0
    );

  const isFull =
    Boolean(registration?.isFull) ||
    spotsLeft <= 0;

  const progress =
    maxParticipants > 0
      ? Math.min(
          participantCount / maxParticipants,
          1
        )
      : 0;

  // =========================================
  // RESPONSIVE
  // =========================================

  const isSmallPhone = width < 360;
  const isLargePhone = width >= 430;

  const titleSize = isSmallPhone
    ? 18
    : isLargePhone
    ? 23
    : 21;

  const tagSize = isSmallPhone
    ? 9
    : isLargePhone
    ? 11
    : 10;

  const certificateSize = isSmallPhone
    ? 9
    : isLargePhone
    ? 12
    : 10;

  const prizeSize = isSmallPhone
    ? 22
    : isLargePhone
    ? 29
    : 26;

  const entrySize = isSmallPhone
    ? 20
    : isLargePhone
    ? 27
    : 24;

  const spotsSize = isSmallPhone
    ? 9
    : isLargePhone
    ? 12
    : 10;

  // =========================================
  // REGISTRATION ACTION
  // =========================================

  const renderRegistrationAction = () => {
    // ---------------------------------------
    // ALREADY REGISTERED
    // ---------------------------------------

    if (isRegistered) {
      return (
        <View className="shrink-0 flex-row items-center rounded-xl border border-teal-100 bg-teal-50 px-2.5 py-2">
          <Ionicons
            name="checkmark-circle"
            size={17}
            color="#078895"
          />

          <Text className="ml-1 text-xs font-bold text-feedants-teal">
            Registered
          </Text>
        </View>
      );
    }

    // ---------------------------------------
    // FULL
    // ---------------------------------------

    if (isFull) {
      return (
        <View className="shrink-0 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2">
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color="#6B7890"
          />

          <Text className="ml-1 text-xs font-bold text-slate-500">
            Registration Closed
          </Text>
        </View>
      );
    }

    // ---------------------------------------
    // REGISTRATION CLOSED
    // ---------------------------------------

    if (status === "REGISTRATION_CLOSED") {
      return (
        <View className="shrink-0 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2">
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color="#6B7890"
          />

          <Text className="ml-1 text-xs font-bold text-slate-500">
            Registration Closed
          </Text>
        </View>
      );
    }

    // ---------------------------------------
    // PARTICIPATE
    // ---------------------------------------

    if (status === "REGISTRATION_OPEN") {
      return (
        <Pressable
          onPress={onParticipate}
          disabled={participating}
          hitSlop={6}
          className="shrink-0 flex-row items-center rounded-xl border border-teal-100 bg-teal-50 px-2.5 py-2"
        >
          {participating ? (
            <ActivityIndicator
              size="small"
              color="#078895"
            />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={17}
                color="#078895"
              />

              <Text className="ml-1 text-xs font-bold text-feedants-teal">
                Participate
              </Text>
            </>
          )}
        </Pressable>
      );
    }

    // ---------------------------------------
    // LIVE
    // ---------------------------------------

    if (status === "LIVE") {
      return (
        <View className="shrink-0 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2">
          <Ionicons
            name="play-circle-outline"
            size={16}
            color="#6B7890"
          />

          <Text className="ml-1 text-xs font-bold text-slate-500">
            Competition Live
          </Text>
        </View>
      );
    }

    // ---------------------------------------
    // ENDED
    // ---------------------------------------

    return (
      <View className="shrink-0 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2">
        <Ionicons
          name="flag-outline"
          size={16}
          color="#6B7890"
        />

        <Text className="ml-1 text-xs font-bold text-slate-500">
          Competition Ended
        </Text>
      </View>
    );
  };

  // =========================================
  // UI
  // =========================================

  return (
    <View className="mx-4 mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white">

      {/* =====================================
          COMPETITION IMAGE
      ===================================== */}

      {competition?.image ? (
        <View
          style={{
            width: "100%",
            height: isSmallPhone
              ? 180
              : isLargePhone
              ? 235
              : 210,
            overflow: "hidden",
          }}
        >
          <Image
            source={{
              uri: competition.image,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: isSmallPhone
              ? 180
              : isLargePhone
              ? 235
              : 210,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F1F5F9",
          }}
        >
          <Ionicons
            name="image-outline"
            size={42}
            color="#94A3B8"
          />

          <Text className="mt-2 text-sm text-slate-400">
            Competition Image
          </Text>
        </View>
      )}

      {/* =====================================
          CONTENT
      ===================================== */}

      <View className="p-5">

        {/* =====================================
            TITLE + ACTION
        ===================================== */}

        <View className="flex-row items-center">

          <View className="flex-1 pr-2">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              style={{
                fontSize: titleSize,
                fontWeight: "800",
                color: "#13294B",
              }}
            >
              {competition?.title || "Competition"}
            </Text>
          </View>

          {renderRegistrationAction()}
        </View>

        {/* =====================================
            TAGS + CERTIFICATE
        ===================================== */}

        <View className="mt-2 flex-row items-center">

          <View className="shrink-0 flex-row items-center">

            {/* CATEGORY */}

            <View className="mr-2 rounded-lg bg-slate-100 px-3 py-1.5">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={{
                  fontSize: tagSize,
                  fontWeight: "600",
                  color: "#13294B",
                }}
              >
                {competition?.category || "Dance"}
              </Text>
            </View>

            {/* TYPE */}

            <View className="rounded-lg bg-slate-100 px-3 py-1.5">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={{
                  fontSize: tagSize,
                  fontWeight: "600",
                  color: "#13294B",
                }}
              >
                {competition?.competitionType ||
                  competition?.type ||
                  "Multi-Win"}
              </Text>
            </View>
          </View>

          {/* CERTIFICATE */}

          <View className="ml-4 flex-1 flex-row items-center">

            <Ionicons
              name="trophy-outline"
              size={
                isSmallPhone
                  ? 20
                  : isLargePhone
                  ? 25
                  : 23
              }
              color="#078895"
            />

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              style={{
                marginLeft: 7,
                flex: 1,
                fontSize: certificateSize,
                fontWeight: "600",
                color: "#078895",
              }}
            >
              Winners get certificate
            </Text>

          </View>
        </View>

        {/* =====================================
            STATS
        ===================================== */}

        <View className="mt-5 flex-row">

          {/* PRIZE */}

          <View className="flex-1 pr-2">

            <Text className="text-xs text-slate-500">
              Prize Pool
            </Text>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              style={{
                marginTop: 3,
                fontSize: prizeSize,
                fontWeight: "800",
                color: "#078895",
              }}
            >
              ₹{competition?.prizePool ?? 0}
            </Text>

          </View>

          {/* ENTRY FEE */}

          <View className="flex-1 border-l border-slate-100 px-3">

            <Text className="text-xs text-slate-500">
              Entry Fee
            </Text>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              style={{
                marginTop: 3,
                fontSize: entrySize,
                fontWeight: "800",
                color: "#13294B",
              }}
            >
              ₹{competition?.entryFee ?? 0}
            </Text>

          </View>

          {/* SPOTS */}

          <View className="flex-[1.15] border-l border-slate-100 pl-3">

            <View className="flex-row items-center">

              <Ionicons
                name="people-outline"
                size={
                  isSmallPhone
                    ? 16
                    : isLargePhone
                    ? 19
                    : 18
                }
                color={
                  isFull
                    ? "#6B7890"
                    : "#078895"
                }
              />

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
                style={{
                  marginLeft: 4,
                  flex: 1,
                  fontSize: spotsSize,
                  fontWeight: "700",
                  color: isFull
                    ? "#6B7890"
                    : "#078895",
                }}
              >
                {isFull
                  ? "Registration Closed"
                  : `Only ${spotsLeft} spots left`}
              </Text>

            </View>

            {/* PROGRESS */}

            <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-teal-100">

              <View
                className="h-full rounded-full bg-feedants-teal"
                style={{
                  width: `${progress * 100}%`,
                }}
              />

            </View>

            {/* BOOKED */}

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              className="mt-2 text-xs text-slate-500"
            >
              {participantCount} / {maxParticipants} Booked
            </Text>

          </View>

        </View>

      </View>
    </View>
  );
}