import React from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomNavigation({ navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallPhone = width < 360;
  const iconSize = isSmallPhone ? 21 : 24;
  const labelSize = isSmallPhone ? 9 : 10;
  const createButtonSize = isSmallPhone ? 50 : 56;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F0F2F4",
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Home */}
        <NavItem
          icon="home-outline"
          label="Home"
          iconSize={iconSize}
          labelSize={labelSize}
          onPress={() => navigation.navigate("Home")}
        />

        {/* Explore */}
        <NavItem
          icon="search-outline"
          label="Explore"
          iconSize={iconSize}
          labelSize={labelSize}
        />

        {/* Create */}
        <Pressable
          hitSlop={6}
          style={{
            width: createButtonSize,
            height: createButtonSize,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#078895",
          }}
        >
          <View
            style={{
              width: isSmallPhone ? 32 : 36,
              height: isSmallPhone ? 32 : 36,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Ionicons
              name="add"
              size={isSmallPhone ? 24 : 27}
              color="#078895"
            />
          </View>
        </Pressable>

        {/* Competitions */}
        <NavItem
          icon="trophy-outline"
          label="Competitions"
          active
          iconSize={iconSize}
          labelSize={labelSize}
        />

        {/* Profile */}
        <NavItem
          icon="person-outline"
          label="Profile"
          iconSize={iconSize}
          labelSize={labelSize}
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </View>
  );
}

// Reusable navigation item
function NavItem({
  icon,
  label,
  active = false,
  onPress,
  iconSize,
  labelSize,
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Ionicons
        name={icon}
        size={iconSize}
        color={active ? "#078895" : "#8A94A6"}
      />

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
        style={{
          marginTop: 3,
          fontSize: labelSize,
          fontWeight: "600",
          color: active ? "#078895" : "#8A94A6",
          maxWidth: "100%",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}