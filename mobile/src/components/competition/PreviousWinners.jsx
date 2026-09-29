import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PreviousWinners({
  winners = [],
  onVideoPress,
}) {
  if (!winners.length) {
    return null;
  }

  return (
    <View className="mt-4">
      {/* Section title */}
      <Text
        className="mx-4 mb-3 text-base font-extrabold text-feedants-navy"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.9}
      >
        Previous Winners
      </Text>

      {/* Horizontal winners list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {winners.map((winner, index) => {
          const name =
            typeof winner === "object"
              ? winner?.name || winner?.username || "Winner"
              : String(winner);

          const image =
            typeof winner === "object"
              ? winner?.image ||
                winner?.avatar ||
                winner?.profileImage ||
                winner?.photo ||
                null
              : null;

          const position =
            typeof winner === "object"
              ? winner?.position ||
                winner?.rank ||
                `${index + 1}${getOrdinal(index + 1)} Winner`
              : `${index + 1}${getOrdinal(index + 1)} Winner`;

          return (
            <Pressable
              key={
                winner?._id ||
                winner?.id ||
                `${name}-${index}`
              }
              onPress={() => {
                if (onVideoPress) {
                  onVideoPress(winner);
                }
              }}
              className="mr-3 w-[180px] rounded-xl border border-slate-100 bg-white px-2 py-2"
            >
              <View className="flex-row items-center">
                {/* Winner image */}
                <View className="relative">
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      resizeMode="cover"
                      className="h-[72px] w-[72px] rounded-lg"
                    />
                  ) : (
                    <View className="h-[72px] w-[72px] items-center justify-center rounded-lg bg-teal-50">
                      <Ionicons
                        name="person"
                        size={28}
                        color="#078895"
                      />
                    </View>
                  )}

                  {/* Play button */}
                  <View className="absolute bottom-1 right-1 h-7 w-7 items-center justify-center rounded-full bg-white">
                    <Ionicons
                      name="play"
                      size={14}
                      color="#078895"
                    />
                  </View>
                </View>

                {/* Winner name and position */}
                <View className="ml-2 flex-1 justify-center">
                  <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    className="text-sm font-bold text-feedants-navy"
                  >
                    {name}
                  </Text>

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    className="mt-1 text-xs font-medium text-feedants-teal"
                  >
                    {position}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Generate ordinal suffix for winner positions
function getOrdinal(number) {
  const lastTwo = number % 100;

  if (lastTwo >= 11 && lastTwo <= 13) {
    return "th";
  }

  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}