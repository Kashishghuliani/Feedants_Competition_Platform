import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CompetitionCard({
  competition,
  onPress,
}) {
  const spotsLeft =
    competition.spotsLeft ??
    (competition.maxParticipants || 0) -
      (competition.participantCount || 0);

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-4 min-w-0 overflow-hidden rounded-2xl bg-white"
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Competition image */}
      <View className="relative h-48 w-full bg-feedants-lightTeal">
        {competition.image ? (
          <Image
            source={{ uri: competition.image }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-feedants-teal">
            <Ionicons
              name="trophy-outline"
              size={42}
              color="#FFFFFF"
            />
          </View>
        )}

        {/* Competition type */}
        <View className="absolute left-3.5 top-3.5 rounded-full bg-white px-2.5 py-1.5">
          <Text className="text-[10px] font-extrabold uppercase text-feedants-navy">
            {competition.type || "Competition"}
          </Text>
        </View>
      </View>

      {/* Card content */}
      <View className="min-w-0 p-4">
        {/* Title */}
        <Text
          numberOfLines={2}
          className="text-[20px] font-black leading-6 text-feedants-navy"
        >
          {competition.title}
        </Text>

        {/* Category */}
        {competition.category ? (
          <Text
            numberOfLines={1}
            className="mt-1 text-[13px] text-feedants-muted"
          >
            {competition.category}
          </Text>
        ) : null}

        {/* Competition stats */}
        <View className="mt-4 flex-row border-t border-feedants-border pt-3.5">
          <View className="min-w-0 flex-1">
            <Text className="text-[10px] text-feedants-muted">
              Prize
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              className="mt-1 text-[15px] font-extrabold text-feedants-teal"
            >
              ₹{competition.prizePool ?? 0}
            </Text>
          </View>

          <View className="min-w-0 flex-1">
            <Text className="text-[10px] text-feedants-muted">
              Entry
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              className="mt-1 text-[15px] font-extrabold text-feedants-teal"
            >
              ₹{competition.entryFee ?? 0}
            </Text>
          </View>

          <View className="min-w-0 flex-1">
            <Text className="text-[10px] text-feedants-muted">
              Spots
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              className="mt-1 text-[15px] font-extrabold text-feedants-teal"
            >
              {spotsLeft}
            </Text>
          </View>
        </View>

        {/* View competition */}
        <View className="mt-4 flex-row items-center justify-between border-t border-feedants-border pt-3.5">
          <Text className="text-[14px] font-extrabold text-feedants-teal">
            View competition
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#078895"
          />
        </View>
      </View>
    </Pressable>
  );
}