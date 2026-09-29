import React from "react";
import { Text, View } from "react-native";

export default function HomeIntro() {
  return (
    <View
      style={{
        paddingHorizontal: 18,
        marginTop: 28,
        marginBottom: 18,
      }}
    >
      {/* Intro title */}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={{
          fontSize: 27,
          fontWeight: "900",
          color: "#17345F",
          letterSpacing: -0.4,
        }}
      >
        Explore Competitions
      </Text>

      {/* Intro description */}
      <Text
        style={{
          marginTop: 7,
          fontSize: 14,
          lineHeight: 21,
          color: "#6B7890",
          maxWidth: 340,
        }}
      >
        Discover competitions and showcase your skills.
      </Text>
    </View>
  );
}