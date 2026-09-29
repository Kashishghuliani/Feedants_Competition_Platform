import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UserReviews({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mt-3 flex-row items-center rounded-2xl border border-slate-100 bg-white p-4"
    >
      {/* Review icon */}
      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={21}
          color="#078895"
        />
      </View>

      {/* Review information */}
      <View className="ml-3 min-w-0 flex-1">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className="text-sm font-extrabold text-feedants-navy"
        >
          Hear From Our Users
        </Text>

        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className="mt-1 text-xs leading-4 text-slate-500"
        >
          See what participants say about Feedants
        </Text>
      </View>

      {/* Navigation arrow */}
      <View className="ml-2 shrink-0">
        <Ionicons
          name="chevron-forward"
          size={21}
          color="#14284B"
        />
      </View>
    </Pressable>
  );
}