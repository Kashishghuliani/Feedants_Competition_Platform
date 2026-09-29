import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function JudgeCard({ judge, onVideoPress }) {
  // Judge data from MongoDB
  const judgeName = judge?.name || judge?.username || "Judge";
  const judgeProfession =
    judge?.profession ||
    judge?.role ||
    judge?.title ||
    judge?.designation ||
    "";
  const judgeExperience =
    judge?.experience || judge?.yearsOfExperience || "";

  return (
    <View className="mx-4 mt-3 flex-row items-center rounded-2xl border border-slate-100 bg-white p-4">
      {/* Judge image */}
      {judge?.image ? (
        <Image
          source={{ uri: judge.image }}
          resizeMode="cover"
          className="h-20 w-20 rounded-full"
        />
      ) : (
        <View className="h-20 w-20 items-center justify-center rounded-full bg-teal-50">
          <Ionicons name="person" size={30} color="#078895" />
        </View>
      )}

      {/* Judge information */}
      <View className="ml-4 flex-1">
        <Text className="text-xs text-slate-500">Judge</Text>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className="mt-1 text-base font-extrabold text-feedants-navy"
        >
          {judgeName}
        </Text>

        {judgeProfession ? (
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            className="mt-1 text-xs text-slate-500"
          >
            {judgeProfession}
          </Text>
        ) : null}

        {judgeExperience ? (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            className="mt-1 text-xs text-slate-500"
          >
            {judgeExperience}
          </Text>
        ) : null}
      </View>

      {/* Intro video */}
      <Pressable
        onPress={onVideoPress}
        hitSlop={8}
        className="ml-2 items-center"
      >
        <View className="h-14 w-14 items-center justify-center rounded-full bg-teal-50">
          <Ionicons name="play" size={26} color="#078895" />
        </View>

        <Text className="mt-1 text-xs font-medium text-feedants-navy">
          Intro Video
        </Text>
      </Pressable>
    </View>
  );
}