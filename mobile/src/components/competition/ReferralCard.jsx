import React from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function ReferralCard({
  referralLink = "https://feedants.com/r/referral123",
}) {
  const { width } = useWindowDimensions();

  const isSmallPhone = width < 360;
  const isLargePhone = width >= 430;

  const titleSize = isSmallPhone ? 13 : isLargePhone ? 16 : 15;
  const rewardSize = isSmallPhone ? 9 : isLargePhone ? 11 : 10;
  const buttonSize = isSmallPhone ? 11 : isLargePhone ? 13 : 12;
  const copySize = isSmallPhone ? 9 : 10;

  // Copy referral link to the device clipboard
  async function copyLink() {
    try {
      await Clipboard.setStringAsync(referralLink);
      Alert.alert("Referral Link", "Referral link copied.");
    } catch (error) {
      console.error("COPY LINK ERROR:", error);
      Alert.alert("Error", "Unable to copy referral link.");
    }
  }

  // Handle referral action
  function handleRefer() {
    Alert.alert(
      "Refer & Earn",
      "Share your referral link with your friends."
    );
  }

  return (
    <View className="mx-4 mt-3 rounded-2xl bg-emerald-50 p-4">
      {/* Header */}
      <View className="flex-row items-center">
        <View className="h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
          <Ionicons
            name="megaphone-outline"
            size={24}
            color="#078895"
          />
        </View>

        <View className="ml-3 min-w-0 flex-1">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={{
              fontSize: titleSize,
              fontWeight: "800",
              color: "#13294B",
            }}
          >
            Refer & Earn more discount
          </Text>
        </View>
      </View>

      {/* Referral link and action */}
      <View className="mt-3 flex-row items-center">
        <View className="min-w-0 flex-1">
          <View className="flex-row">
            {/* Referral link */}
            <View className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                className="text-xs text-slate-600"
              >
                {referralLink}
              </Text>
            </View>

            {/* Copy button */}
            <Pressable
              onPress={copyLink}
              className="ml-1.5 shrink-0 justify-center rounded-lg border border-slate-200 bg-white px-3"
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: copySize,
                  fontWeight: "700",
                  color: "#078895",
                }}
              >
                Copy Link
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Refer button */}
        <View className="ml-3 w-[31%] min-w-0 items-center">
          <Pressable
            onPress={handleRefer}
            className="w-full items-center justify-center rounded-lg bg-feedants-teal px-2 py-2.5"
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={{
                fontSize: buttonSize,
                fontWeight: "800",
                color: "#FFFFFF",
              }}
            >
              Refer Now
            </Text>
          </Pressable>

          {/* Referral reward */}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            style={{
              marginTop: 5,
              fontSize: rewardSize,
              color: "#078895",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            You earn ₹10 for every signup
          </Text>
        </View>
      </View>
    </View>
  );
}