import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UploadSubmissionButton({
  onPress,
  isRegistered = false,
  isFull = false,
  registrationClosed = false,
  ended = false,
  participating = false,
}) {
  // Determine button state
  let title = "Participate";
  let subtitle = "Join this competition";
  let icon = "trophy-outline";
  let disabled = false;

  // User is already registered
  if (isRegistered) {
    title = "Registered";
    subtitle = "You are registered for this competition";
    icon = "checkmark-circle";
    disabled = true;
  }
  // All participation spots are booked
  else if (isFull) {
    title = "Registration Closed";
    subtitle = "All participation spots have been taken";
    icon = "lock-closed-outline";
    disabled = true;
  }
  // Registration deadline has passed
  else if (registrationClosed) {
    title = "Registration Closed";
    subtitle = "Registration for this competition has ended";
    icon = "lock-closed-outline";
    disabled = true;
  }
  // Competition has ended
  else if (ended) {
    title = "Competition Ended";
    subtitle = "This competition is no longer accepting registrations";
    icon = "lock-closed-outline";
    disabled = true;
  }

  // API request is in progress
  if (participating) {
    title = "Participating...";
    subtitle = "Please wait";
    icon = null;
    disabled = true;
  }

  const isUnavailable =
    isFull || registrationClosed || ended;

  const textColor = isRegistered
    ? "#078895"
    : isUnavailable
    ? "#6B7890"
    : "#FFFFFF";

  return (
    <View className="mx-4 mt-4">
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={({ pressed }) => ({
          minHeight: 62,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isRegistered
            ? "#EAF7F7"
            : isUnavailable
            ? "#E9EDF1"
            : "#078895",
          borderWidth: isRegistered ? 1 : 0,
          borderColor: isRegistered
            ? "#BFE3E5"
            : "transparent",
          opacity: pressed && !disabled ? 0.85 : 1,
        })}
      >
        {/* Button title */}
        <View className="flex-row items-center">
          {participating ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Ionicons
              name={icon}
              size={21}
              color={textColor}
            />
          )}

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={{
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "800",
              color: textColor,
            }}
          >
            {title}
          </Text>
        </View>

        {/* Button subtitle */}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          style={{
            marginTop: 2,
            fontSize: 11,
            fontWeight: "500",
            color: isRegistered
              ? "#078895"
              : isUnavailable
              ? "#6B7890"
              : "#EAF7F7",
          }}
        >
          {subtitle}
        </Text>
      </Pressable>
    </View>
  );
}