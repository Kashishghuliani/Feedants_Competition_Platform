import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeHeader({ user, navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallPhone = width < 360;

  // Open user profile
  function handleProfilePress() {
    navigation.navigate("Profile");
  }

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 18,
        paddingTop: insets.top + (isSmallPhone ? 8 : 10),
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F7F8F8",
      }}
    >
      {/* Header information */}
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "900",
            color: "#17345F",
            letterSpacing: -0.5,
          }}
        >
          feedants
        </Text>

        <Text
          numberOfLines={1}
          style={{
            marginTop: 4,
            fontSize: 13,
            color: "#6B7890",
          }}
        >
          Hi, {user?.name || "there"} 👋
        </Text>
      </View>

      {/* Profile button */}
      <Pressable
        onPress={handleProfilePress}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        hitSlop={8}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: pressed ? "#EAF7F8" : "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 5,
          elevation: 2,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Ionicons
          name="person-outline"
          size={21}
          color="#17345F"
        />
      </Pressable>
    </View>
  );
}