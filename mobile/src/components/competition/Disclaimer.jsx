import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Disclaimer({ text }) {
  const { width } = useWindowDimensions();
  const isSmallPhone = width < 360;

  if (!text) {
    return null;
  }

  return (
    <View className="mx-4 mt-3 flex-row items-start rounded-xl bg-feedants-light px-4 py-3">
      {/* Disclaimer icon */}
      <View className="shrink-0 pt-0.5">
        <Ionicons
          name="information-circle-outline"
          size={isSmallPhone ? 19 : 21}
          color="#078895"
        />
      </View>

      {/* Disclaimer text */}
      <View className="ml-2 flex-1">
        <Text
          style={{
            fontSize: isSmallPhone ? 11 : 12,
            lineHeight: isSmallPhone ? 17 : 19,
            color: "#14284B",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Disclaimer:</Text>{" "}
          {text}
        </Text>
      </View>
    </View>
  );
}