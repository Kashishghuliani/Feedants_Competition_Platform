import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Rewards({ rewards = [] }) {
  // Hide the section when no rewards are available
  if (!Array.isArray(rewards) || rewards.length === 0) {
    return null;
  }

  return (
    <View className="mx-4 mt-4 rounded-2xl border border-slate-100 bg-white p-4">
      {/* Section title */}
      <View className="flex-row items-center">
        <Text className="text-base font-extrabold text-feedants-navy">
          Rewards
        </Text>

        <Text className="ml-2 text-xs text-slate-500">
          (All Positions)
        </Text>
      </View>

      {/* Rewards list */}
      <View className="mt-3">
        {rewards.map((reward, index) => {
          // Read reward data from different possible API fields
          const position =
            reward && typeof reward === "object"
              ? reward?.position ||
                reward?.rank ||
                reward?.place ||
                ""
              : "";

          const amount =
            reward && typeof reward === "object"
              ? reward?.amount ??
                reward?.prize ??
                reward?.prizeMoney ??
                reward?.value
              : reward;

          const displayPosition =
            position || `${index + 1}${getOrdinal(index + 1)} Winner`;

          return (
            <View
              key={reward?._id || reward?.id || index}
              className={`flex-row items-center py-3 ${
                index < rewards.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              {/* Position icon */}
              <Ionicons
                name={index < 3 ? "trophy" : "star-outline"}
                size={23}
                color={index < 3 ? "#F59E0B" : "#078895"}
              />

              {/* Position */}
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                className="ml-4 flex-1 text-sm font-bold text-feedants-navy"
              >
                {displayPosition}
              </Text>

              {/* Prize amount */}
              {amount !== undefined &&
                amount !== null &&
                amount !== "" && (
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    className="text-base font-extrabold text-feedants-teal"
                  >
                    ₹{amount}
                  </Text>
                )}
            </View>
          );
        })}
      </View>
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