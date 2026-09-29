import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CompetitionHeader({ navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallPhone = width < 360;
  const textSize = isSmallPhone ? 13 : 15;
  const iconSize = isSmallPhone ? 22 : 25;
  const languageTextSize = isSmallPhone ? 10 : 11;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: Math.max(insets.top, 8),
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Back navigation */}
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={8}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="chevron-back"
          size={iconSize}
          color="#14284B"
        />
        <Text
          numberOfLines={1}
          style={{
            marginLeft: 5,
            fontSize: textSize,
            fontWeight: "700",
            color: "#14284B",
          }}
        >
          Go back
        </Text>
      </Pressable>

      {/* Language switch */}
      <View
        style={{
          marginLeft: 12,
          flexShrink: 0,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#E2E8EC",
          backgroundColor: "#FFFFFF",
          borderRadius: 999,
          padding: 4,
        }}
      >
        {/* English */}
        <View
          style={{
            borderRadius: 999,
            backgroundColor: "#078895",
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              fontSize: languageTextSize,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            ENG
          </Text>
        </View>

        {/* Hindi */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              fontSize: languageTextSize,
              fontWeight: "600",
              color: "#14284B",
            }}
          >
            हिंदी
          </Text>
        </View>
      </View>
    </View>
  );
}