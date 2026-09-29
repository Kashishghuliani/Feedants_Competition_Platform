import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyCompetitions() {
  return (
    <View
      style={{
        marginHorizontal: 14,
        marginTop: 10,
        marginBottom: 18,
        paddingHorizontal: 24,
        paddingVertical: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        // Card shadow
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Empty state icon */}
      <View
        style={{
          width: 68,
          height: 68,
          borderRadius: 34,
          backgroundColor: "#EAF7F8",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="trophy-outline"
          size={34}
          color="#078895"
        />
      </View>

      {/* Title */}
      <Text
        style={{
          marginTop: 18,
          fontSize: 17,
          fontWeight: "800",
          color: "#17345F",
          textAlign: "center",
        }}
      >
        No competitions available
      </Text>

      {/* Description */}
      <Text
        style={{
          marginTop: 7,
          fontSize: 13,
          lineHeight: 20,
          color: "#6B7890",
          textAlign: "center",
          maxWidth: 280,
        }}
      >
        Check back later for new competitions.
      </Text>
    </View>
  );
}